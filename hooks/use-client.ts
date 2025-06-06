import { useGlobalStore } from '@/store/data';
import { CanvasAPI } from 'canvas-client';
import { getAccountKey } from '@/lib/auth';
import { useEffect, useState } from 'react';

export function useClient() {
  const { accounts, currentAccount } = useGlobalStore();
  const account = accounts[currentAccount || 0];
  const [client, setClient] = useState<CanvasAPI | null>(null);

  useEffect(() => {
    if (!account) return;
    getAccountKey((currentAccount || 0).toString()).then((key) => {
      if (key) setClient(new CanvasAPI(account.domain, [key]));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return { client, domain: account?.domain, accountIndex: currentAccount || 0 };
}
