import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="account-chooser" options={{ headerShown: false }} />
      <Stack.Screen name="add-account" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}