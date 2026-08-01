import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { products, type Product } from "@/lib/catering-data";

type CartLine = { id: string; qty: number };

type ShopContextValue = {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  cartItems: { product: Product; qty: number }[];
  addToCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "luxe-cart";
const WISH_KEY = "luxe-wishlist";

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readStored<CartLine[]>(CART_KEY, []));
    setWishlist(readStored<string[]>(WISH_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback((id: string) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { id, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  }, []);

  const value = useMemo<ShopContextValue>(() => {
    const cartItems = cart
      .map((line) => {
        const product = products.find((p) => p.id === line.id);
        return product ? { product, qty: line.qty } : null;
      })
      .filter((x): x is { product: Product; qty: number } => x !== null);

    return {
      cart,
      wishlist,
      cartItems,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      cartTotal: cartItems.reduce((sum, i) => sum + i.product.price * i.qty, 0),
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted: (id: string) => wishlist.includes(id),
    };
  }, [cart, wishlist, addToCart, setQty, removeFromCart, clearCart, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(value);
