import { View, Text } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { Button } from './Button';

interface EmptyStateProps {
  heading: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}

// components.md "Empty state" — shared across S02 (offline), S03 (no
// results), S08 (no favorites), S09 (no messages), S10 (no uploads).
export function EmptyState({ heading, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View
      className="flex-1 items-center justify-center px-8 py-16"
      accessible
      accessibilityRole="header"
      accessibilityLabel={heading}
    >
      <View className="w-[120px] h-[120px] rounded-full bg-surface items-center justify-center mb-4">
        <Inbox size={48} color="#6D28D9" />
      </View>
      <Text className="text-lg font-semibold text-text text-center">{heading}</Text>
      {body ? (
        <Text className="text-sm text-text-muted text-center mt-1">{body}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-4">
          <Button label={actionLabel} variant="secondary" onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
