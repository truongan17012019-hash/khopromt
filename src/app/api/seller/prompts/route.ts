import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface CreatePromptRequest {
  title: string;
  description: string;
  content: string;
  price: number;
  category_id: string;
  tool_ids?: string[];
  image_url?: string;
  tags?: string[];
}

/**
 * POST /api/seller/prompts
 * Seller uploads a new prompt
 * Requires seller role
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = auth.replace("Bearer ", "");
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "seller" && profile.role !== "admin")) {
      return NextResponse.json(
        { error: "Permission denied - must be seller or admin" },
        { status: 403 }
      );
    }

    const body: CreatePromptRequest = await req.json();

    // Validation
    if (
      !body.title ||
      !body.description ||
      !body.content ||
      !body.category_id ||
      body.price < 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    if (body.title.length < 5 || body.title.length > 200) {
      return NextResponse.json(
        { error: "Title must be 5-200 characters" },
        { status: 400 }
      );
    }

    if (body.description.length < 20) {
      return NextResponse.json(
        { error: "Description must be at least 20 characters" },
        { status: 400 }
      );
    }

    if (body.price > 10000000) {
      return NextResponse.json(
        { error: "Price must be less than 10,000,000" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check category exists
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("id", body.category_id)
      .single();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    // Create prompt
    const { data: prompt, error: createError } = await supabase
      .from("prompts")
      .insert({
        title: body.title,
        description: body.description,
        content: body.content,
        slug,
        price: body.price,
        category_id: body.category_id,
        image_url: body.image_url || null,
        tags: body.tags || [],
        author_id: user.id,
        is_active: true,
        created_at: new Date(),
      })
      .select()
      .single();

    if (createError) {
      console.error("Create prompt error:", createError);
      throw createError;
    }

    // Add tools if provided
    if (body.tool_ids && body.tool_ids.length > 0) {
      const toolMappings = body.tool_ids.map((tool_id) => ({
        prompt_id: prompt.id,
        tool_id,
      }));

      const { error: toolError } = await supabase
        .from("prompt_tools")
        .insert(toolMappings);

      if (toolError) {
        console.error("Add tools error:", toolError);
        // Don't fail - tools addition is secondary
      }
    }

    return NextResponse.json(
      {
        message: "Prompt created successfully",
        data: prompt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST seller prompt error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seller/prompts
 * Get seller's own prompts with edit capability
 */
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = auth.replace("Bearer ", "");
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const { data: prompts, error } = await supabase
      .from("prompts")
      .select(
        `
        id,
        title,
        description,
        price,
        sold,
        rating,
        is_active,
        created_at,
        categories(id, name),
        prompt_tools(tool_id, tools(id, name))
      `
      )
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: prompts || [] });
  } catch (error) {
    console.error("GET seller prompts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
