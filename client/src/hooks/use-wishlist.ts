import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useWishlist() {
  return useQuery({
    queryKey: [api.wishlist.list.path],
    queryFn: async () => {
      const res = await fetch(api.wishlist.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return api.wishlist.list.responses[200].parse(await res.json());
    },
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(api.wishlist.toggle.path, {
        method: api.wishlist.toggle.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle wishlist");
      return api.wishlist.toggle.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.wishlist.list.path] });
    },
  });
}
