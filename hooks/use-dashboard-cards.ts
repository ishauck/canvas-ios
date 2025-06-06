import { useQuery } from "@tanstack/react-query";
import { getDashboardCards } from "@/services/canvas/get-dashboard-cards";
import { useClient } from "@/hooks/use-client";

export default function useDashboardCards() {
  const { accountId, domain, token } = useClient();

  return useQuery({
    queryKey: ['dashboard-cards', accountId],
    queryFn: () => getDashboardCards(domain, token),
  });
}