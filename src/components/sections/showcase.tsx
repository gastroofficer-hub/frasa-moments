import { useMemo, useState } from "react";
import { Heart, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/reveal";
import { categories, events, products, type Category } from "@/lib/catering-data";
import { formatPrice, useShop } from "@/components/shop-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Categories() {
  const [active, setActive] = useState<Category | null>(null);

  return (
    <section id="categories" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our range</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Product categories</h2>
          <p className="mt-4 text-muted-foreground">
            Six signature collections — open any category for the full gallery.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 70}>
              <button
                type="button"
                onClick={() => setActive(c)}
                className="hover-lift group relative block h-80 w-full overflow-hidden rounded-3xl text-left shadow-soft"
                aria-label={`Open ${c.name} gallery`}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-108"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-6">
                  <span className="font-display block text-2xl text-primary-foreground">{c.name}</span>
                  <span className="mt-1 block text-sm text-primary-foreground/75">{c.blurb}</span>
                  <span className="mt-4 inline-block text-xs tracking-[0.22em] text-gold uppercase">
                    View gallery
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
            {active?.gallery.map((g) => (
              <figure key={g.src} className="overflow-hidden rounded-2xl">
                <img src={g.src} alt={g.caption} loading="lazy" className="h-44 w-full object-cover" />
                <figcaption className="px-1 py-2 text-xs text-muted-foreground">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
          <Button asChild variant="gold" className="mt-2 self-start">
            <a href="#menu" onClick={() => setActive(null)}>
              Browse the menu
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function FeaturedProducts() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const { addToCart, toggleWishlist, isWishlisted } = useShop();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (filter === "all" || p.category === filter) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
  }, [filter, query]);

  return (
    <section id="menu" className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The menu</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Featured products</h2>
        </Reveal>

        <Reveal className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[{ id: "all", name: "All" }, ...categories.map((c) => ({ id: c.id, name: c.name }))].map(
              (c) => (
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
              ),
            )}
          </div>
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="rounded-full bg-card pl-9"
            />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <article className="hover-lift flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-soft">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] hover:scale-108"
                  />
                  <button
                    type="button"
                    onClick={() => toggleWishlist(p.id)}
                    aria-label={`${isWishlisted(p.id) ? "Remove" : "Save"} ${p.name} ${isWishlisted(p.id) ? "from" : "to"} wishlist`}
                    className="glass-panel absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full"
                  >
                    <Heart
                      className={cn("h-4 w-4", isWishlisted(p.id) ? "fill-gold text-gold" : "text-foreground")}
                    />
                  </button>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-display text-xl text-gold">{formatPrice(p.price)}</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        addToCart(p.id);
                        toast.success(`${p.name} added to cart`);
                      }}
                    >
                      <Plus className="h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No products match that search.
          </p>
        )}
      </div>
    </section>
  );
}

export function Events() {
  return (
    <section id="events" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Occasions</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Catering for every event</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <Reveal key={e.name} delay={i * 70}>
              <article className="hover-lift group h-full overflow-hidden rounded-3xl bg-card shadow-soft">
                <div className="h-48 overflow-hidden">
                  <img
                    src={e.image}
                    alt={e.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-108"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl">{e.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
