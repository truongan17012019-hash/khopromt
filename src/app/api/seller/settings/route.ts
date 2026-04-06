import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/seller/settings
 * Get seller's profile settings
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

    // Get seller profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "id, email, display_name, avatar_url, bio, default_bank_name, default_bank_account, role"
      )
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Check if user is seller or admin
    if (profile.role !== "seller" && profile.role !== "admin") {
      return NextResponse.json(
        { error: "Permission denied - must be seller or admin" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      data: {
        id: profile.id,
        email: user.email || "",
        display_name: profile.display_name || "",
        avatar_url: profile.avatar_url,
        bio: profile.bio || "",
        default_bank_name: profile.default_bank_name || "",
        default_bank_account: profile.default_bank_account || "",
      },
    });
  } catch (error) {
    console.error("GET seller settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/seller/settings
 * Update seller's profile settings
 */
export async function PATCH(req: NextRequest) {
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

    const body = await req.json();
    const { display_name, bio, default_bank_name, default_bank_account } = body;

    // Validate inputs
    if (display_name && display_name.length < 2) {
      return NextResponse.json(
        { error: "Display name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: "Bio must be 500 characters or less" },
        { status: 400 }
      );
    }

    // Validate bank account if provided
    if (default_bank_account) {
      const cleanAccount = default_bank_account.replace(/\s/g, "");
      if (!/^[0-9]{8,20}$/.test(cleanAccount)) {
        return NextResponse.json(
          { error: "Invalid bank account format" },
          { status: 400 }
        );
      }
    }

    // Update profile
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({
        ...(display_name && { display_name }),
        ...(bio !== undefined && { bio }),
        ...(default_bank_name && { default_bank_name }),
        ...(default_bank_account && { default_bank_account }),
        updated_at: new Date(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      data: {
        id: updated.id,
        email: user.email || "",
        display_name: updated.display_name || "",
        avatar_url: updated.avatar_url,
        bio: updated.bio || "",
        default_bank_name: updated.default_bank_name || "",
        default_bank_account: updated.default_bank_account || "",
      },
    });
  } catch (error) {
    console.error("PATCH seller settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
