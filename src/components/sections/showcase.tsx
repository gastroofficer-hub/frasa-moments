import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/reveal";
import { events } from "@/lib/catering-data";
import { categoriesQuery, productsQuery, type Category, type Product } from "@/lib/catalog";
import { formatPrice, useShop, type Variant } from "@/components/shop-store";
import { unitPriceFor } from "@/components/site-header";
import boxDeluxe from "/img/box-deluxe.jpg";
import boxStandard from "/img/box-standard.jpg";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Categories() {
  const [active, setActive] = useState<Category | null>(null);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products = [] } = useQuery(productsQuery);

  const activeProducts = active ? products.filter((p) => p.category_id === active.id) : [];

  return (
    <section id="categories" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Naše nabídka</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Kategorie produktů</h2>
          <p className="mt-4 text-muted-foreground">
            Otevřete kteroukoliv kategorii a prohlédněte si, co v ní najdete.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 70}>
              <button
                type="button"
                onClick={() => setActive(c)}
                className="hover-lift group relative block h-80 w-full overflow-hidden rounded-3xl text-left shadow-soft"
                aria-label={`Otevřít kategorii ${c.name}`}
              >
                <img
                  src={c.image_url}
                  alt={c.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-108"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-6">
                  <span className="font-display block text-2xl text-foreground">{c.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{c.blurb}</span>
                  <span className="mt-4 inline-block text-xs tracking-[0.22em] text-gold uppercase">
                    Zobrazit
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">{active?.name}</DialogTitle>
            <DialogDescription>{active?.blurb}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-3">
            {activeProducts.map((p) => (
              <figure key={p.id} className="overflow-hidden rounded-2xl">
                <img src={p.image_url} alt={p.name} loading="lazy" className="h-44 w-full object-cover" />
                <figcaption className="px-1 py-2 text-xs text-muted-foreground">{p.name}</figcaption>
              </figure>
            ))}
          </div>
          <Button asChild variant="gold" className="mt-2 self-start">
            <a href="#menu" onClick={() => setActive(null)}>
              Přejít do nabídky
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function VersionsShowcase() {
  const versions = [
    {
      tag: "Deluxe",
      image: boxDeluxe,
      title: "Černá krabička se zlatým logem",
      copy: "Matně černé prémiové balení, vpředu malé zlaté logo obehnané zlatým vavřínovým věncem. Pro chvíle, kde záleží na každém detailu.",
    },
    {
      tag: "Standart",
      image: boxStandard,
      title: "Bílá krabička s černým logem",
      copy: "Čisté bílé balení s decentním černým logem. Stejná kvalita obsahu, jednodušší forma.",
    },
  ];

  return (
    <section id="verze" className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Dvě verze</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">DELUXE &amp; STANDART</h2>
          <p className="mt-4 text-muted-foreground">
            Každý produkt si můžete objednat ve dvou provedeních balení.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {versions.map((v, i) => (
            <Reveal key={v.tag} delay={i * 90}>
              <article className="hover-lift overflow-hidden rounded-3xl bg-card shadow-soft">
                <img
                  src={v.image}
                  alt={v.title}
                  loading="lazy"
                  width={1200}
                  height={912}
                  className="h-64 w-full object-cover sm:h-80"
                />
                <div className="p-8">
                  <p className="eyebrow">{v.tag}</p>
                  <h3 className="mt-3 text-2xl">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [variant, setVariant] = useState<Variant>("standard");
  const [qty, setQty] = useState(product.min_qty);

  const unit = unitPriceFor(product, variant);

  return (
    <article className="hover-lift flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-soft">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={768}
          className="h-52 w-full object-cover"
        />
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={`${isWishlisted(product.id) ? "Odebrat z" : "Přidat do"} oblíbených: ${product.name}`}
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur"
        >
          <Heart className={cn("h-4 w-4", isWishlisted(product.id) ? "fill-gold text-gold" : "text-muted-foreground")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {(["standard", "deluxe"] as Variant[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              aria-pressed={variant === v}
              className={cn(
                "rounded-full border px-3 py-2 text-xs tracking-[0.14em] uppercase transition-colors",
                variant === v
                  ? "border-gold bg-gold text-gold-foreground"
                  : "border-border text-muted-foreground hover:border-gold hover:text-gold",
              )}
            >
              {v === "deluxe" ? "Deluxe" : "Standart"}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-display text-xl text-gold">{formatPrice(unit)} / ks</p>
            <p className="text-xs text-muted-foreground">minimálně {product.min_qty} ks</p>
          </div>
          <Input
            type="number"
            min={product.min_qty}
            step={1}
            value={qty}
            aria-label={`Počet kusů — ${product.name}`}
            onChange={(e) => setQty(Number(e.target.value))}
            className="h-10 w-24 rounded-full text-center"
          />
        </div>

        <Button
          variant="gold"
          className="mt-4 w-full"
          onClick={() => {
            const finalQty = Math.max(qty || 0, product.min_qty);
            setQty(finalQty);
            addToCart({
              productId: product.id,
              name: product.name,
              image: product.image_url,
              variant,
              unitPrice: unit,
              minQty: product.min_qty,
              qty: finalQty,
            });
            toast.success(`${product.name} — ${finalQty} ks (${variant === "deluxe" ? "DELUXE" : "STANDART"})`);
          }}
        >
          <Plus className="h-4 w-4" /> Do košíku
        </Button>
      </div>
    </article>
  );
}

export function FeaturedProducts() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products = [], isLoading } = useQuery(productsQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.is_active &&
        (filter === "all" || p.category_id === filter) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
  }, [filter, query, products]);

  return (
    <section id="menu" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Nabídka</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Produkty</h2>
          <p className="mt-4 text-muted-foreground">
            Prodáváme jednotlivé produkty — vždy od 10 kusů od jedné položky.
          </p>
        </Reveal>

        <Reveal className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[{ id: "all", name: "Vše" }, ...categories.map((c) => ({ id: c.id, name: c.name }))].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                aria-pressed={filter === c.id}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs tracking-wide transition-colors",
                  filter === c.id
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-gold hover:text-gold",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hledat produkt"
              aria-label="Hledat produkt"
              className="rounded-full bg-card pl-9"
            />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">Žádné produkty neodpovídají výběru.</p>
        )}
      </div>
    </section>
  );
}

export function Events() {
  return (
    <section id="events" className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Příležitosti</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Akce, které obsloužíme</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <Reveal key={e.name} delay={i * 70}>
              <article className="hover-lift relative h-64 overflow-hidden rounded-3xl shadow-soft">
                <img
                  src={e.image}
                  alt={e.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl text-foreground">{e.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{e.copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
