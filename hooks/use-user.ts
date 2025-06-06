import { useGlobalStore } from "@/store/data";

export default function useUser() {
    const accounts = useGlobalStore((state) => state.accounts);
    const currentAccount = useGlobalStore((state) => state.currentAccount);
    if (currentAccount === undefined) {
        return null;
    }
    return accounts[currentAccount];
}