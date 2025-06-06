import { useGlobalStore } from '@/store/data';

export function useClient() {
  const { accounts, currentAccount } = useGlobalStore();
  const account = accounts[currentAccount || 0];

  return { domain: account?.domain, token: account?.key, accountId: account?.id };
}
