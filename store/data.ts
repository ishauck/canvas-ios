import { expoStorage, secureStorage } from '@/lib/expo-zustand-bridge';
import { BrandVariables } from '@/lib/brand-variables';
import { Account } from '@/types/data';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type GlobalData = {
  currentAccount?: number;
  accounts: Account[];
  brandVariables: Record<string, BrandVariables>;
};

type GlobalActions = {
  setCurrentAccount: (account: number) => void;
  addAccount: (account: Account) => void;
  removeAccount: (account: Account) => void;
  setAccounts: (accounts: Account[]) => void;
  setBrandVariable: (domain: string, value: BrandVariables) => void;
  setBrandVariables: (value: Record<string, BrandVariables>) => void;
  removeBrandVariables: (domain: string) => void;
  clearBrandVariables: () => void;
};

type GlobalStore = GlobalData & GlobalActions;

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      accounts: [],
      brandVariables: {},
      setCurrentAccount: (account: number) => set({ currentAccount: account }),
      addAccount: (account: Account) => set({ accounts: [...get().accounts, account] }),
      removeAccount: (account: Account) =>
        set({ accounts: get().accounts.filter((a) => a.id !== account.id) }),
      setAccounts: (accounts: Account[]) => set({ accounts }),
      setBrandVariable: (domain: string, value: BrandVariables) =>
        set({
          brandVariables: { ...get().brandVariables, [domain]: value },
        }),
      setBrandVariables: (value: Record<string, BrandVariables>) => set({ brandVariables: value }),
      removeBrandVariables: (domain: string) =>
        set({
          brandVariables: Object.fromEntries(
            Object.entries(get().brandVariables).filter(([k]) => k !== domain)
          ),
        }),
      clearBrandVariables: () => set({ brandVariables: {} }),
    }),
    {
      name: 'global-storage',
      storage: createJSONStorage(() => expoStorage),
    }
  )
);
