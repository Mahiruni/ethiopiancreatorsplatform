"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";

type Category = { id: string; slug: string; name_en: string; name_am: string | null; is_active: boolean; position: number };

export function CategoryManager({ initial }: { initial: Category[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [form, setForm] = useState({ slug: "", name_en: "", name_am: "" });
  const [message, setMessage] = useState("");

  async function createCategory() {
    setBusy("new"); setMessage("");
    const r = await fetch("/api/admin/categories", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const body = await r.json().catch(() => ({}));
    setBusy(null);
    if (!r.ok) return setMessage(body.error || "Could not add category.");
    setItems((old) => [...old, body.category]); setForm({ slug: "", name_en: "", name_am: "" });
  }

  async function updateCategory(item: Category) {
    setBusy(item.id); setMessage("");
    const r = await fetch("/api/admin/categories", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(item) });
    const body = await r.json().catch(() => ({})); setBusy(null);
    if (!r.ok) setMessage(body.error || "Could not save category.");
  }

  return <div className="space-y-5">
    <section className="card p-5">
      <h2 className="text-lg font-semibold">Add category</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
        <input className="input" placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}/>
        <input className="input" placeholder="English name" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })}/>
        <input className="input" placeholder="የአማርኛ ስም" value={form.name_am} onChange={(e) => setForm({ ...form, name_am: e.target.value })}/>
        <button onClick={createCategory} disabled={busy === "new" || !form.slug || !form.name_en} className="btn-primary"><Plus size={16}/> Add</button>
      </div>
      {message && <p className="mt-3 text-sm text-[#9a3f35]">{message}</p>}
    </section>

    <section className="space-y-3">
      {items.map((item, index) => <article key={item.id} className="card grid gap-3 p-4 md:grid-cols-[1fr_1fr_1fr_auto_auto] md:items-center">
        <div><div className="text-[11px] font-bold uppercase tracking-[.1em] text-[#7c857f]">Slug</div><div className="mt-1 text-sm font-semibold">{item.slug}</div></div>
        <input aria-label={`${item.slug} English name`} className="input" value={item.name_en} onChange={(e) => setItems((all) => all.map((x) => x.id === item.id ? { ...x, name_en: e.target.value } : x))}/>
        <input aria-label={`${item.slug} Amharic name`} className="input" value={item.name_am || ""} onChange={(e) => setItems((all) => all.map((x) => x.id === item.id ? { ...x, name_am: e.target.value } : x))}/>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item.is_active} onChange={(e) => setItems((all) => all.map((x) => x.id === item.id ? { ...x, is_active: e.target.checked } : x))}/> Active</label>
        <button className="btn-secondary" disabled={busy === item.id} onClick={() => updateCategory({ ...item, position: index })}><Save size={15}/> Save</button>
      </article>)}
    </section>
  </div>;
}
