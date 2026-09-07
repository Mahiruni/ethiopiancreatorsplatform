import { requireRole } from "@/lib/supabase/auth";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminCategoriesPage() {
  const { supabase } = await requireRole(["administrator", "super_administrator"]);
  const { data } = await supabase.from("profile_categories").select("id,slug,name_en,name_am,is_active,position").order("position").order("name_en");
  return <div>
    <p className="eyebrow">Taxonomy</p>
    <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Profile categories</h1>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68716c]">Manage the creator and business categories exposed during onboarding and profile editing. Disabling a category stops new selection without rewriting existing profiles.</p>
    <div className="mt-6"><CategoryManager initial={(data || []) as any}/></div>
  </div>;
}
