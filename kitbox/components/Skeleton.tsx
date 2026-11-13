import { View } from 'react-native';

// components.md "Progress / loading skeleton" — grid-card shaped, matches
// AppCard's grid dimensions exactly so layout doesn't jump on load.
// (A real shimmer animation is a follow-up; this is a static placeholder
// so the shell and vertical slice aren't blocked on Reanimated setup.)
export function AppCardSkeleton() {
  return (
    <View className="w-[164px] h-[220px] bg-surface rounded-lg p-3 opacity-60">
      <View className="w-16 h-16 rounded-md bg-border" />
      <View className="h-3 w-20 bg-border rounded-sm mt-3" />
      <View className="h-3 w-28 bg-border rounded-sm mt-2" />
    </View>
  );
}

export function AppCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <View
      className="flex-row flex-wrap gap-3 px-4"
      accessible
      accessibilityLabel="Loading"
    >
      {Array.from({ length: count }).map((_, i) => (
        <AppCardSkeleton key={i} />
      ))}
    </View>
  );
}
