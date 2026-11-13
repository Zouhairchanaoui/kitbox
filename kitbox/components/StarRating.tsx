import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';

interface StarRatingProps {
  value: number; // 0–5, supports halves for display
  size?: number;
  showLabel?: boolean;
}

// Read-only variant of components.md's "Star rating control". Star fill
// is the one documented exception to "tokens only" — a literal amber,
// since a rating's meaning isn't accent or warning.
const STAR_FILL = '#d6a700';

export function StarRating({ value, size = 14, showLabel = true }: StarRatingProps) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <View
      className="flex-row items-center gap-1"
      accessible
      accessibilityLabel={`${value.toFixed(1)} out of 5`}
    >
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            color={STAR_FILL}
            fill={i <= rounded ? STAR_FILL : 'transparent'}
          />
        ))}
      </View>
      {showLabel ? (
        <Text className="text-xs text-text-muted">{value.toFixed(1)}</Text>
      ) : null}
    </View>
  );
}
