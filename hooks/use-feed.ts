import { useQuery } from '@tanstack/react-query';
import { useClient } from './use-client';
import getFeed from '@/services/canvas/get-feed';

export default function useFeed() {
  const { domain, token, accountId } = useClient();

  return useQuery({
    queryKey: ['feed', accountId],
    queryFn: () => {
      if (!domain || !token) {
        return [];
      }
      return getFeed(domain, token);
    },
  });
}
