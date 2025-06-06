import { Redirect, Tabs } from "expo-router";
import { View, Text, useColorScheme, Pressable, Animated } from "react-native";
import { useGlobalStore } from "@/store/data";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useMemo, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/app/Header";
import useBrandVariables from "@/hooks/use-brand-variables";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

// Utility to darken a hex color by a percentage
function darkenHexColor(hex: string, percent: number): string {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.floor(r * (1 - percent));
    g = Math.floor(g * (1 - percent));
    b = Math.floor(b * (1 - percent));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Custom tab bar button with animated scale
function LargeTabBarButton({ children, onPress, accessibilityState }: BottomTabBarButtonProps) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1.1,
            friction: 4,
            tension: 80,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{ flex: 1 }}
            accessibilityState={accessibilityState}
        >
            <Animated.View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 60, // Increase height
                    minWidth: 80,  // Increase width
                    transform: [{ scale }],
                }}
            >
                {children}
            </Animated.View>
        </Pressable>
    );
}

export default function Layout() {
    const { accounts, currentAccount, setCurrentAccount } = useGlobalStore();
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const brandVariables = useBrandVariables();
    const brand = brandVariables.data;

    // Tab bar active/inactive tint from brand variables if available
    const tabBarActiveTintColor = useMemo(() => {
        return theme.text;
    }, [theme.text]);

    const tabBarInactiveTintColor = useMemo(() => {
        return colorScheme === 'dark' ? '#272727' : theme.text;
    }, [colorScheme, theme.text]);

    // Extracted styles for reuse and readability
    const tabBarStyle = useMemo(() => ({
        backgroundColor: theme.background,
        borderTopWidth: 0,
        padding: 0,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
    }), [theme.background]);

    const emptyAccountsStyle = useMemo(() => ({
        backgroundColor: theme.background,
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    }), [theme.background]);

    // Set current account if only one exists and none is selected
    useEffect(() => {
        if (!currentAccount && accounts.length === 1) {
            setCurrentAccount(0);
        }
    }, [accounts, currentAccount, setCurrentAccount]);

    // Redirect if no current account and not exactly one account
    if (!currentAccount && accounts.length !== 1) {
        return <Redirect href="/app/account-chooser" />;
    }

    // Show message if no accounts exist
    if (accounts.length === 0) {
        return (
            <View style={emptyAccountsStyle}>
                <Text>No accounts found.</Text>
            </View>
        );
    }

    return (
        <Tabs
            screenOptions={{
                tabBarStyle,
                tabBarActiveTintColor,
                tabBarInactiveTintColor,
                tabBarIconStyle: { marginBottom: 0 },
                tabBarLabel: '',
                header: () => <Header />, // Custom header
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
                    tabBarButton: (props) => <LargeTabBarButton {...props} />,
                }}
            />
            <Tabs.Screen name="courses" options={{
                tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
                tabBarButton: (props) => <LargeTabBarButton {...props} />,
            }} />
        </Tabs>
    );
}