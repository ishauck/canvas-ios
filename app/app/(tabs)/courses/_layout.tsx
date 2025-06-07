import { Stack } from 'expo-router';
import { useGlobalStore } from '@/store/data';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const queryClient = new QueryClient();

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>

    );
}