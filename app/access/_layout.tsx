import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack screenOptions={{ gestureEnabled: false }}>
            <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="input" options={{ headerShown: false, gestureEnabled: false }} />
        </Stack>
    );
}