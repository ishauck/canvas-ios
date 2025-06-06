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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from 'expo-haptics';

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

    const handlePress = (event: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) onPress(event);
    };

    return (
        <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{ flex: 1 }}
            accessibilityState={accessibilityState}
        >
            <Animated.View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 20, // Reduced height
                    minWidth: 60,  // Reduced width
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
    const safeAreaInsets = useSafeAreaInsets();
    const brand = brandVariables.data;

    // Tab bar active/inactive tint from brand variables if available
    const tabBarActiveTintColor = useMemo(() => {
        return colorScheme === 'dark' ? '#fff' : '#212121';
    }, [colorScheme]);

    const tabBarInactiveTintColor = useMemo(() => {
        return colorScheme === 'dark' ? '#272727' : '#4a4a4a';
    }, [colorScheme]);

    // Reduced height for a more compact tab bar
    const tabBarStyle = useMemo(() => ({
        backgroundColor: theme.background,
        borderTopWidth: 0,
        padding: 0,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        height: 20 + safeAreaInsets.bottom, // Set a smaller fixed height
        paddingBottom: safeAreaInsets.bottom,
    }), [theme.background, safeAreaInsets.bottom]);

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
                tabBarShowLabel: false,
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
            <Tabs.Screen name="settings" options={{
                tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
                tabBarButton: (props) => <LargeTabBarButton {...props} />,
            }} />
        </Tabs>
    );
}