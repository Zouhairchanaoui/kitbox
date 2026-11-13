import '../global.css';
import { Stack } from 'expo-router';

// Root layout. The (tabs) group below owns the bottom nav; this stack
// adds screens that sit above it (app details, search) per recon's
// screen inventory.
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="app/[id]"
        options={{ headerShown: true, title: '', presentation: 'card' }}
      />
      <Stack.Screen
        name="search"
        options={{ headerShown: true, title: 'Search', presentation: 'modal' }}
      />
    </Stack>
  );
}
