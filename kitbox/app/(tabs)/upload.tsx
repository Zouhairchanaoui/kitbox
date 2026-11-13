import { View, Text, SafeAreaView } from 'react-native';

// S06 — Upload. Stub for the shell step; full file-picker + metadata form
// + Storage signed-upload flow is a must-have for the next build pass
// (needs replica-backend's Supabase Storage wiring to be real, not fake).
export default function UploadScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg items-center justify-center px-8">
      <Text className="text-lg font-semibold text-text text-center">Upload</Text>
      <Text className="text-sm text-text-muted text-center mt-1">
        Sharing your own app is coming in the next build pass.
      </Text>
    </SafeAreaView>
  );
}
