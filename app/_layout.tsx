import { Stack } from 'expo-router';

const isAuthenticated = false;

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="access" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="app" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Protected>
    </Stack>
  );
}