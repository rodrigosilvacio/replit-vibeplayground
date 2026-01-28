import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type CreateVibeRequest, type UpdateVibeRequest } from "@shared/schema";

export function useVibes() {
  return useQuery({
    queryKey: [api.vibes.list.path],
    queryFn: async () => {
      const res = await fetch(api.vibes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch vibes");
      return api.vibes.list.responses[200].parse(await res.json());
    },
    // Poll frequently for that "alive" playground feel
    refetchInterval: 2000,
  });
}

export function useCreateVibe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVibeRequest) => {
      const validated = api.vibes.create.input.parse(data);
      const res = await fetch(api.vibes.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.vibes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create vibe");
      }
      return api.vibes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.vibes.list.path] }),
  });
}

export function useUpdateVibe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateVibeRequest) => {
      const validated = api.vibes.update.input.parse(updates);
      const url = buildUrl(api.vibes.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update vibe");
      return api.vibes.update.responses[200].parse(await res.json());
    },
    // Optimistic updates are handled by the component via local state usually, 
    // but invalidation ensures consistency eventually.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.vibes.list.path] }),
  });
}

export function useDeleteVibe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.vibes.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete vibe");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.vibes.list.path] }),
  });
}
