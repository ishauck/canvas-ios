import { StatusBar, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBrandVariables from "@/hooks/use-brand-variables";
import isDark from "@/utils/is-dark";
import { useEffect, useState } from "react";

export default function Header() {
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const brandVariables = useBrandVariables();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsDarkMode(isDark(brandVariables.data?.['ic-brand-global-nav-bgd'] || theme.background));
    }, [brandVariables.data, theme.background]);

    if (brandVariables.isLoading) {
        return <View style={{ height: safeAreaInsets.top, backgroundColor: theme.background }} />;
    }

    return (
        <View style={{ height: safeAreaInsets.top, backgroundColor: brandVariables.data?.['ic-brand-global-nav-bgd'] }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        </View>
    );
}