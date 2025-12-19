import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { Product } from "@shared/schema";

// Type definitions inferred from schema/routes
type ProductListResponse = z.infer<typeof api.products.list.responses[200]>;
type ProductResponse = z.infer<typeof api.products.get.responses[200]>;
type ProductInput = z.infer<typeof api.products.create.input>;

export function useProducts(filters?: { category?: string; sort?: 'price_asc' | 'price_desc' | 'newest'; search?: string }) {
  const queryKey = [api.products.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Manually construct query string since buildUrl is for path params
      const url = new URL(api.products.list.path, window.location.origin);
      if (filters?.category) url.searchParams.append("category", filters.category);
      if (filters?.sort) url.searchParams.append("sort", filters.sort);
      if (filters?.search) url.searchParams.append("search", filters.search);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Admin functionality (simplified for this demo)
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProductInput) => {
      const res = await fetch(api.products.create.path, {
        method: api.products.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create product");
      return api.products.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    },
  });
}
