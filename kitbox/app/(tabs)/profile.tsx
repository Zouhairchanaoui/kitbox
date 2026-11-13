import { View, Text, SafeAreaView } from 'react-native';

// S10 — Profile. Stub for the shell step; needs real auth (Supabase)
// before "your uploads/downloads/activity" means anything.
export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg items-center justify-center px-8">
      <Text className="text-lg font-semibold text-text text-center">Profile</Text>
      <Text className="text-sm text-text-muted text-center mt-1">
        Sign-in and your stats are coming in the next build pass.
      </Text>
    </SafeAreaView>
  );
}
