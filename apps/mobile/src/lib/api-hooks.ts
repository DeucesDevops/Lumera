import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { apiRequest } from "./api";
import { useAuth } from "./auth";

type QueryOptions = {
  enabled?: boolean;
  demoFallback?: boolean;
};

export function useApiQuery<TData>(queryKey: QueryKey, path: string, options: QueryOptions = {}) {
  const { accessToken, isDemo } = useAuth();

  return useQuery({
    queryKey,
    enabled: Boolean(accessToken) && !isDemo && options.enabled !== false,
    queryFn: () => apiRequest<TData>(path, { accessToken }),
  });
}

export function usePublicApiQuery<TData>(queryKey: QueryKey, path: string) {
  return useQuery({
    queryKey,
    queryFn: () => apiRequest<TData>(path),
  });
}

export function useApiMutation<TData, TVariables>(path: string, method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST") {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TVariables) =>
      apiRequest<TData>(path, {
        method,
        body: method === "DELETE" ? undefined : JSON.stringify(variables),
        accessToken,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });
}
