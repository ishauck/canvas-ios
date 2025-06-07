import { useQuery } from '@tanstack/react-query';
import { useClient } from './use-client';
import getBrandVariables from '@/lib/brand-variables';
import { useGlobalStore } from '@/store/data';
import { useEffect } from 'react';

export default function useBrandVariables(domain?: string) {
  const setBrandVariable = useGlobalStore((state) => state.setBrandVariable);
  const brandVariables = useGlobalStore((state) => state.brandVariables);
  let { domain: currentDomain } = useClient();
  domain = domain || currentDomain;

  const res = useQuery({
    queryKey: ['brand-variables', domain],
    queryFn: async () => {
      if (brandVariables[domain]) {
        return brandVariables[domain];
      }
      const res = await getBrandVariables(domain);
      return res;
    },
  });

  useEffect(() => {
    if (res.data) {
      setBrandVariable(domain, res.data);
    }
  }, [res.data, domain, setBrandVariable]);

  return res;
}
