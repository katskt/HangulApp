import { usePathname } from "expo-router";

export function useRouteParams() {
  const parts = usePathname().split("/").filter(Boolean);
  return {
    level: parts[1],
    category: parts[2],
    id: parts[3],
  };
}