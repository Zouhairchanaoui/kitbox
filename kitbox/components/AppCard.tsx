import { Pressable, View, Text, Image } from 'react-native';
import { Package } from 'lucide-react-native';
import { StarRating } from './StarRating';
import type { KitboxApp } from '../lib/types';

interface AppCardProps {
  app: KitboxApp;
  variant?: 'grid' | 'list';
  onPress: () => void;
}

// components.md "App card" — grid variant used on the store feed (S02),
// list variant on search/favorites (S03/S08).
export function AppCard({ app, variant = 'grid', onPress }: AppCardProps) {
  const label = `${app.name}, ${app.avgRating.toFixed(1)} out of 5, ${app.category}`;

  if (variant === 'list') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="flex-row items-center gap-3 h-[72px] px-4 bg-surface rounded-lg active:scale-[0.98]"
      >
        <AppIcon app={app} size={48} />
        <View className="flex-1">
          <Text numberOfLines={1} className="text-base text-text font-medium">
            {app.name}
          </Text>
          <Text numberOfLines={1} className="text-sm text-text-muted">
            {app.shortDescription}
          </Text>
        </View>
        <StarRating value={app.avgRating} showLabel={false} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="w-[164px] h-[220px] bg-surface rounded-lg p-3 shadow-card active:scale-[0.98]"
    >
      <AppIcon app={app} size={64} />
      <Text numberOfLines={1} className="text-sm text-text font-medium mt-2">
        {app.name}
      </Text>
      <Text numberOfLines={2} className="text-xs text-text-muted mt-1">
        {app.shortDescription}
      </Text>
      <View className="mt-auto">
        <StarRating value={app.avgRating} size={12} />
      </View>
    </Pressable>
  );
}

function AppIcon({ app, size }: { app: KitboxApp; size: number }) {
  if (app.iconUrl) {
    return (
      <Image
        source={{ uri: app.iconUrl }}
        accessible={false}
        style={{ width: size, height: size, borderRadius: 14 }}
      />
    );
  }
  // Placeholder glyph — never Appteka's icon; real icons arrive with
  // each uploader's own artwork once replica-backend wires up Storage.
  return (
    <View
      style={{ width: size, height: size, borderRadius: 14 }}
      className="bg-bg items-center justify-center border border-border"
    >
      <Package size={size * 0.5} color="#6D28D9" />
    </View>
  );
}
