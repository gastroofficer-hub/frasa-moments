import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Menu, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DELIVERY_FEE,
  MIN_DELIVERY_QTY,
  formatPrice,
  useShop,
  type Variant,
} from "@/components/shop-store";
import { productsQuery, type Product } from "@/lib/catalog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import logoAsset from "@/assets/frasa-moments-logo.png.asset.json";

const navLinks = [
  { href: "#categories", label: "Kategorie" },
  { href: "#menu", label: "Nabídka" },
  { href: "#dorty", label: "Dorty" },
  { href: "#rozvoz", label: "Rozvoz" },
  { href: "#events", label: "Akce" },
  { href: "#gallery", label: "Galerie" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Kontakt" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex shrink-0 items-center gap-3", className)} aria-label="FRÁŠA MOMENTS — domů">
      <img src={logoAsset.url} alt="" className="h-11 w-11 rounded-full object-cover shadow-gold" />
      <span className="hidden font-display text-lg font-semibold tracking-[0.22em] uppercase sm:inline sm:text-xl">
        <span className="text-gold">Fráša</span> Moments
      </span>
    </a>
  );
}

export function unitPriceFor(product: Product, variant: Variant) {
  return variant === "deluxe" ? product.price + product.deluxe_surcharge : product.price;
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, cart, cartTotal, setQty, removeFromCart, clearCart, wishlist, toggleWishlist, addToCart } =
    useShop();
  const { data: products = [] } = useQuery(productsQuery);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 5);
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [query, products]);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const add = (p: Product, variant: Variant) =>
    addToCart({
      productId: p.id,
      name: p.name,
      image: p.image_url,
      variant,
      unitPrice: unitPriceFor(p, variant),
      minQty: p.min_qty,
    });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-panel shadow-soft" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Hlavní navigace">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Hledat v nabídce" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Oblíbené, ${wishlist.length} položek`}
                className="relative"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && <Badge value={wishlist.length} />}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Oblíbené</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-4 pb-6">
                {wishlistProducts.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    Uložte si sem své oblíbené sousto.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {wishlistProducts.map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          loading="lazy"
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-sm text-gold">{formatPrice(p.price)} / ks</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            add(p, "standard");
                            toast.success(`${p.name} — ${p.min_qty} ks přidáno do košíku`);
                          }}
                        >
                          Přidat
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Odebrat ${p.name} z oblíbených`}
                          onClick={() => toggleWishlist(p.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Košík, ${cartCount} kusů`} className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && <Badge value={cartCount} />}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Váš výběr</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-4">
                {cart.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    Košík je prázdný — produkty lze objednat od 10 kusů.
                  </p>
                ) : (
                  <ul className="space-y-5">
                    {cart.map((line) => (
                      <li key={line.key} className="flex gap-3">
                        <img
                          src={line.image}
                          alt={line.name}
                          loading="lazy"
                          className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{line.name}</p>
                          <p className="text-[0.7rem] tracking-[0.2em] text-gold uppercase">
                            {line.variant === "deluxe" ? "Deluxe" : "Standart"}
                          </p>
                          <p className="text-sm text-gold">{formatPrice(line.unitPrice)} / ks</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              aria-label={`Ubrat kus u ${line.name}`}
                              onClick={() => setQty(line.key, line.qty - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm tabular-nums">{line.qty} ks</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              aria-label={`Přidat kus u ${line.name}`}
                              onClick={() => setQty(line.key, line.qty + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="ml-auto h-7 w-7"
                              aria-label={`Odebrat ${line.name}`}
                              onClick={() => removeFromCart(line.key)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">min. {line.minQty} ks</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Celkem {cartCount} ks</span>
                    <span className="font-display text-xl">{formatPrice(cartTotal)}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {cartCount >= MIN_DELIVERY_QTY
                      ? `Rozvoz je možný — do 60 km od Svitav za ${formatPrice(DELIVERY_FEE)}.`
                      : `Rozvoz zajišťujeme od ${MIN_DELIVERY_QTY} kusů (chybí ${MIN_DELIVERY_QTY - cartCount} ks). Menší objednávku lze vyzvednout osobně.`}
                  </p>
                  <Separator className="my-4" />
                  <Button
                    className="w-full"
                    variant="gold"
                    onClick={() => {
                      toast.success("Poptávka zahájena", {
                        description: "Vyplňte kontaktní formulář, ozveme se do 24 hodin.",
                      });
                      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Odeslat poptávku
                  </Button>
                  <Button variant="ghost" className="mt-2 w-full" onClick={clearCart}>
                    Vyprázdnit košík
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label="Otevřít menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {menuOpen && (
        <nav className="glass-panel xl:hidden" aria-label="Mobilní navigace">
          <ul className="mx-auto max-w-7xl px-5 py-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-sm text-muted-foreground hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Hledat v nabídce</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Např. losos, makronka, plato…"
            aria-label="Hledaný výraz"
          />
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {results.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-accent">
                <img src={p.image_url} alt={p.name} loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(p.price)} / ks · min. {p.min_qty} ks</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    add(p, "standard");
                    toast.success(`${p.name} — ${p.min_qty} ks přidáno`);
                  }}
                >
                  Přidat
                </Button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">Nic jsme nenašli.</li>
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function Badge({ value }: { value: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.625rem] font-medium text-gold-foreground">
      {value}
    </span>
  );
}
