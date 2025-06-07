import { Stack } from 'expo-router';
import { useGlobalStore } from '@/store/data';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const queryClient = new QueryClient();

export default function Layout() {
  const { accounts } = useGlobalStore();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="access" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Protected guard={accounts.length > 0}>
            <Stack.Screen name="app" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}