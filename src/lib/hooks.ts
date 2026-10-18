"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product, Category, Order, Settings } from "@/lib/types";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed");
  return res.json() as Promise<T>;
}

export function useProducts(params: {
  category?: string;
  featured?: boolean;
  search?: string;
  size?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params.category && params.category !== "all") sp.set("category", params.category);
  if (params.featured) sp.set("featured", "true");
  if (params.search) sp.set("search", params.search);
  if (params.size) sp.set("size", params.size);
  if (params.color) sp.set("color", params.color);
  if (params.minPrice) sp.set("minPrice", params.minPrice);
  if (params.maxPrice) sp.set("maxPrice", params.maxPrice);
  if (params.sort) sp.set("sort", params.sort);
  if (params.limit) sp.set("limit", String(params.limit));
  const key = sp.toString();
  return useQuery<{ products: Product[] }>({
    queryKey: ["products", key],
    queryFn: () => fetchJSON(`/api/products?${key}`),
  });
}

export function useProduct(id: string | null) {
  return useQuery<{ product: Product }>({
    queryKey: ["product", id],
    queryFn: () => fetchJSON(`/api/products/${id}`),
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string | null) {
  return useQuery<{ products: Product[] }>({
    queryKey: ["product-slug", slug],
    queryFn: () => fetchJSON(`/api/products?search=${encodeURIComponent(slug || "")}`),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery<{ categories: Category[] }>({
    queryKey: ["categories"],
    queryFn: () => fetchJSON("/api/categories"),
  });
}

export function useSettings() {
  return useQuery<{ settings: Settings | null }>({
    queryKey: ["settings"],
    queryFn: () => fetchJSON("/api/settings"),
  });
}

export function useOrders(status?: string) {
  const q = status && status !== "all" ? `?status=${status}` : "";
  return useQuery<{ orders: Order[] }>({
    queryKey: ["orders", status],
    queryFn: () => fetchJSON(`/api/orders${q}`),
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => fetchJSON("/api/stats"),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useProductMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
  return { create, update, remove };
}

export function useCategoryMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
  return { create, update, remove };
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}
