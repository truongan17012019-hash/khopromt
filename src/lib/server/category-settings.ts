import { categories as defaultCategories, type Category } from "@/data/prompts";
import { createServerClient } from "@/lib/supabase";

export async function getCategoriesFromSettings(): Promise<Category[]> {
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return defaultCategories;
  }
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,icon,description,count,color,sort_order,is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error || !data || !data.length) {
    return defaultCategories;
  }
  const dbCategories = data.map((row: any) => ({
    id: row.id,
    name: row.name,
    icon: row.icon || "📁",
    description: row.description || "",
    count: Number(row.count || 0),
    color: row.color || "bg-slate-500",
  }));
  const byId = new Map(dbCategories.map((item: Category) => [item.id, item]));
  for (const fallback of defaultCategories) {
    if (!byId.has(fallback.id)) {
      dbCategories.push(fallback);
    }
  }
  return dbCategories;
}

export async function saveCategoriesToSettings(next: Category[]) {
  const supabase = createServerClient();
  const payload = (next || []).map((item, index) => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
    description: item.description,
    count: Number(item.count || 0),
    color: item.color,
    sort_order: index + 1,
    is_active: true,
  }));
  await supabase.from("categories").update({ is_active: false }).neq("id", "__never__");
  const { error } = await supabase.from("categories").upsert(payload, {
    onConflict: "id",
  });
  if (error) throw new Error(error.message);
}
