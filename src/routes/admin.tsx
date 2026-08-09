import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cakesQuery, categoriesQuery, productsQuery, type Product } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Správa nabídky | FRÁŠA MOMENTS" },
      { name: "description", content: "Administrace produktů, kategorií a fotografií FRÁŠA MOMENTS." },
      { property: "og:title", content: "Správa nabídky | FRÁŠA MOMENTS" },
      { property: "og:description", content: "Administrace produktů, kategorií a fotografií." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const empty = {
  name: "",
  description: "",
  price: 0,
  deluxe_surcharge: 0,
  min_qty: 10,
  category_id: "",
  image_url: "",
  is_active: true,
  sort_order: 100,
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [draft, setDraft] = useState<Partial<Product>>(empty);
  const [uploading, setUploading] = useState(false);

  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: cakes = [] } = useQuery(cakesQuery);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: admin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      setIsAdmin(!!admin);
      setReady(true);
    })();
  }, [navigate]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["cakes"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return null;
    }
    return `/api/public/img/${path}`;
  };

  const save = async () => {
    const payload = {
      name: draft.name ?? "",
      description: draft.description ?? "",
      price: Number(draft.price ?? 0),
      deluxe_surcharge: Number(draft.deluxe_surcharge ?? 0),
      min_qty: Number(draft.min_qty ?? 10),
      category_id: draft.category_id || null,
      image_url: draft.image_url ?? "",
      is_active: draft.is_active ?? true,
      sort_order: Number(draft.sort_order ?? 100),
    };
    const res = draft.id
      ? await supabase.from("products").update(payload).eq("id", draft.id)
      : await supabase.from("products").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Uloženo");
    setDraft(empty);
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Smazáno");
    refresh();
  };

  if (!ready) return <main className="grid min-h-screen place-items-center text-sm text-muted-foreground">Načítám…</main>;

  if (!isAdmin)
    return (
      <main className="grid min-h-screen place-items-center px-5 text-center">
        <div>
          <h1 className="font-display text-2xl">Nemáte oprávnění</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tento účet nemá roli administrátora.
          </p>
          <Button className="mt-6" variant="gold" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}>
            Odhlásit se
          </Button>
        </div>
      </main>
    );

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Správa nabídky</h1>
        <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}>
          Odhlásit
        </Button>
      </div>

      <section className="mt-10 rounded-3xl bg-card p-8 shadow-soft">
        <h2 className="text-xl">{draft.id ? "Upravit produkt" : "Nový produkt"}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="p-name">Název</Label>
            <Input id="p-name" className="mt-2" value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="p-desc">Popis</Label>
            <Textarea id="p-desc" rows={3} className="mt-2" value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="p-price">Cena za kus (Kč)</Label>
            <Input id="p-price" type="number" className="mt-2" value={draft.price ?? 0} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="p-dlx">Příplatek DELUXE (Kč)</Label>
            <Input id="p-dlx" type="number" className="mt-2" value={draft.deluxe_surcharge ?? 0} onChange={(e) => setDraft({ ...draft, deluxe_surcharge: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="p-min">Minimální počet kusů</Label>
            <Input id="p-min" type="number" className="mt-2" value={draft.min_qty ?? 10} onChange={(e) => setDraft({ ...draft, min_qty: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="p-cat">Kategorie</Label>
            <select
              id="p-cat"
              className="mt-2 h-10 w-full rounded-full border border-input bg-background px-4 text-sm"
              value={draft.category_id ?? ""}
              onChange={(e) => setDraft({ ...draft, category_id: e.target.value })}
            >
              <option value="">— bez kategorie —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="p-img">Fotografie</Label>
            <div className="mt-2 flex items-center gap-3">
              <Input
                id="p-img"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setDraft((d) => ({ ...d, image_url: url }));
                }}
              />
              {draft.image_url && <img src={draft.image_url} alt="Náhled" className="h-14 w-14 rounded-xl object-cover" />}
            </div>
            {uploading && <p className="mt-1 text-xs text-muted-foreground">Nahrávám…</p>}
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="gold" onClick={save}>Uložit</Button>
          {draft.id && <Button variant="outline" onClick={() => setDraft(empty)}>Zrušit úpravy</Button>}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl">Produkty ({products.length})</h2>
        <ul className="mt-4 space-y-3">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
              <img src={p.image_url} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.price} Kč · DELUXE +{p.deluxe_surcharge} Kč · min. {p.min_qty} ks ·{" "}
                  {categories.find((c) => c.id === p.category_id)?.name ?? "bez kategorie"}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setDraft(p)}>Upravit</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>Smazat</Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl">Dorty ({cakes.length})</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {cakes.map((c) => (
            <li key={c.id} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
              <img src={c.image_url} alt={c.name} className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.kind === "savory" ? "Slaný" : "Sladký"}</p>
              </div>
              <Input
                type="file"
                accept="image/*"
                className="w-40"
                aria-label={`Změnit fotku dortu ${c.name}`}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (!url) return;
                  const { error } = await supabase.from("cakes").update({ image_url: url }).eq("id", c.id);
                  if (error) { toast.error(error.message); return; }
                  toast.success("Fotka změněna");
                  refresh();
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
