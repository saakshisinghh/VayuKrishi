// use-profile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/api/profile";

export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });
}
