import { useQuery } from '@tanstack/react-query';
import { useClient } from './use-client';

export default function useCourses() {
  const { client } = useClient();

  return useQuery({
    queryKey: ['courses'],
    queryFn: () => {
      if (!client) throw new Error('No client found');
      return client.getCourses();
    },
  });
}
