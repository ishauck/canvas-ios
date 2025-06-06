import { Redirect, Stack } from 'expo-router';
import { useGlobalStore } from '@/store/data';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );  
}