import { useQuery } from "@tanstack/react-query";
import { getColors } from "@/services/canvas/get-colors";
import { useClient } from "@/hooks/use-client";

export default function useColors() {
  const { accountId, domain, token } = useClient();

  return useQuery({
    queryKey: ['colors', accountId],
    queryFn: () => getColors(domain, token),
  });
}