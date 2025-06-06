import { useQuery } from '@tanstack/react-query';
import { useClient } from './use-client';
import { getCourses } from '@/services/canvas/get-courses';

export default function useCourses() {
  const { domain, token } = useClient();

  return useQuery({
    queryKey: ['courses', domain, token],
    queryFn: async () => {
      if (!domain || !token) {
        console.log('No domain or token found');
        return [];
      }
      return await getCourses(domain, token);
    },
  });
}
