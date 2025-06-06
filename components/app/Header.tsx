import { View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBrandVariables from "@/hooks/use-brand-variables";

import tunnel from 'tunnel-rat'

export default function Header() {
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const brandVariables = useBrandVariables();

    if (brandVariables.isLoading) {
        return <View style={{ height: safeAreaInsets.top, backgroundColor: theme.background }} />;
    }

    return (
        <View style={{ height: safeAreaInsets.top, backgroundColor: brandVariables.data?.['ic-brand-global-nav-bgd'] }} />
    );
}