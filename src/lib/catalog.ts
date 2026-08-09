import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  name: string;
  blurb: string;
  image_url: string;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  deluxe_surcharge: number;
  min_qty: number;
  category_id: string | null;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

export type Cake = {
  id: string;
  name: string;
  description: string;
  kind: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,blurb,image_url,sort_order")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map((p) => ({
      ...p,
      price: Number(p.price),
      deluxe_surcharge: Number(p.deluxe_surcharge),
    })) as Product[];
  },
});

export const cakesQuery = queryOptions({
  queryKey: ["cakes"],
  queryFn: async (): Promise<Cake[]> => {
    const { data, error } = await supabase.from("cakes").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as Cake[];
  },
});

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
