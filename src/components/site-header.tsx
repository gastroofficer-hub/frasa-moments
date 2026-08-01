import { useEffect, useMemo, useState } from "react";
import { Heart, Menu, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice, useShop } from "@/components/shop-store";
import { products } from "@/lib/catering-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#categories", label: "Categories" },
  { href: "#menu", label: "Menu" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

function Logo() {
  return (
    <a href="#top" className="flex shrink-0 items-baseline gap-2" aria-label="LUXE Catering home">
      <span className="font-display text-xl font-semibold tracking-[0.22em] uppercase">Luxe</span>
      <span className="eyebrow hidden sm:inline">Catering</span>
    </a>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, cartItems, cartTotal, setQty, removeFromCart, clearCart, wishlist, toggleWishlist, addToCart } =
    useShop();

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
  }, [query]);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-panel shadow-soft" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
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
          <Button variant="ghost" size="icon" aria-label="Search menu" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Wishlist, ${wishlist.length} items`} className="relative">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && <Badge value={wishlist.length} />}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Wishlist</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-4 pb-6">
                {wishlistProducts.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    Save your favourite bites here.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {wishlistProducts.map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-sm text-gold">{formatPrice(p.price)}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            addToCart(p.id);
                            toast.success(`${p.name} added to cart`);
                          }}
                        >
                          Add
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove ${p.name} from wishlist`}
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
              <Button variant="ghost" size="icon" aria-label={`Cart, ${cartCount} items`} className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && <Badge value={cartCount} />}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Your selection</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-4">
                {cartItems.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    Your cart is empty — explore the menu to start building your order.
                  </p>
                ) : (
                  <ul className="space-y-5">
                    {cartItems.map(({ product, qty }) => (
                      <li key={product.id} className="flex gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="text-sm text-gold">{formatPrice(product.price)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              aria-label={`Decrease quantity of ${product.name}`}
                              onClick={() => setQty(product.id, qty - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              aria-label={`Increase quantity of ${product.name}`}
                              onClick={() => setQty(product.id, qty + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="ml-auto h-7 w-7"
                              aria-label={`Remove ${product.name}`}
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-display text-xl">{formatPrice(cartTotal)}</span>
                  </div>
                  <Separator className="my-4" />
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast.success("Inquiry started", {
                        description: "Complete the contact form and we'll confirm within 24 hours.",
                      });
                      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Send inquiry
                  </Button>
                  <Button variant="ghost" className="mt-2 w-full" onClick={clearCart}>
                    Clear cart
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          <Button asChild className="ml-2 hidden lg:inline-flex">
            <a href="#contact">Order Now</a>
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-base transition-colors hover:bg-secondary hover:text-gold"
                  >
                    {l.label}
                  </a>
                ))}
                <Button asChild className="mt-4">
                  <a href="#contact" onClick={() => setMenuOpen(false)}>
                    Order Now
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Search the menu</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Canapés, truffles, platters…"
            aria-label="Search products"
          />
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {results.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">No matching items.</li>
            )}
            {results.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-secondary"
                  onClick={() => {
                    setSearchOpen(false);
                    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <img src={p.image} alt="" loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{p.description}</span>
                  </span>
                  <span className="text-sm text-gold">{formatPrice(p.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function Badge({ value }: { value: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-gold-foreground">
      {value}
    </span>
  );
}
