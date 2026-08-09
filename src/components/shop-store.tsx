import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Variant = "deluxe" | "standard";

export type CartLine = {
  key: string;
  productId: string;
  name: string;
  image: string;
  variant: Variant;
  unitPrice: number;
  minQty: number;
  qty: number;
};

export type AddPayload = Omit<CartLine, "key" | "qty"> & { qty?: number };

type ShopContextValue = {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  addToCart: (payload: AddPayload) => void;
  setQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "frasa-cart";
const WISH_KEY = "frasa-wishlist";

export const MIN_DELIVERY_QTY = 30;
export const FAR_DELIVERY_QTY = 100;
export const DELIVERY_FEE = 100;
export const DELIVERY_RADIUS_KM = 60;

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

  const addToCart = useCallback((payload: AddPayload) => {
    const key = `${payload.productId}:${payload.variant}`;
    const addQty = Math.max(payload.qty ?? payload.minQty, payload.minQty);
    setCart((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + addQty } : l));
      return [...prev, { ...payload, key, qty: addQty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      prev.flatMap((l) => {
        if (l.key !== key) return [l];
        if (qty < l.minQty) return [];
        return [{ ...l, qty }];
      }),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  }, []);

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      wishlist,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      cartTotal: cart.reduce((sum, l) => sum + l.unitPrice * l.qty, 0),
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted: (id: string) => wishlist.includes(id),
    }),
    [cart, wishlist, addToCart, setQty, removeFromCart, clearCart, toggleWishlist],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
