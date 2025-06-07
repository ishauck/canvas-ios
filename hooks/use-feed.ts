import { useInfiniteQuery } from '@tanstack/react-query';
import { useClient } from './use-client';
import getFeed, { CanvasActivityStreamItem } from '@/services/canvas/get-feed';

export default function useFeed() {
  const { domain, token, accountId } = useClient();

  return useInfiniteQuery<{ items: CanvasActivityStreamItem[]; nextUrl?: string }, Error>({
    queryKey: ['feed', accountId],
    queryFn: ({ pageParam }) => {
      if (!domain || !token) {
        return Promise.resolve({ items: [], nextUrl: undefined });
      }
      return getFeed(domain, token, pageParam as string | undefined);
    },
    getNextPageParam: (lastPage) => lastPage.nextUrl,
    enabled: !!domain && !!token,
    initialPageParam: undefined,
  });
}
