import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Package } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { StarRating } from '../../components/StarRating';
import { EmptyState } from '../../components/EmptyState';
import { getApp, getReviews, downloadApp } from '../../lib/data';
import type { InstallState, KitboxApp, Review } from '../../lib/types';

function formatSize(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

// S04 — App details. F01's second (and last) tap: "Install" here starts
// the download; this is also where F07 (reviews) is read, with the full
// write flow (S05) left as a stub for the next build pass.
export default function AppDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [app, setApp] = useState<KitboxApp | null | undefined>(undefined);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [install, setInstall] = useState<InstallState>({ status: 'not-installed' });

  useEffect(() => {
    if (!id) return;
    getApp(id).then(setApp);
    getReviews(id).then(setReviews);
  }, [id]);

  if (app === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color="#6D28D9" />
      </View>
    );
  }

  if (app === null) {
    return <EmptyState heading="App not found" body="It may have been removed." />;
  }

  const handleInstall = async () => {
    setInstall({ status: 'downloading', progress: 0 });
    try {
      await downloadApp(app.id, (pct) => setInstall({ status: 'downloading', progress: pct }));
      setInstall({ status: 'installed' });
    } catch {
      setInstall({ status: 'error' });
    }
  };

  const installLabel =
    install.status === 'not-installed'
      ? 'Get'
      : install.status === 'downloading'
        ? `Getting it… ${install.progress ?? 0}%`
        : install.status === 'installed'
          ? 'Open'
          : install.status === 'update-available'
            ? 'Update'
            : 'Retry';

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="pb-10">
      <View className="px-4 pt-4 flex-row gap-4 items-center">
        <View className="w-20 h-20 rounded-lg bg-surface items-center justify-center border border-border">
          <Package size={36} color="#6D28D9" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-text">{app.name}</Text>
          <Text className="text-sm text-text-muted" numberOfLines={1}>
            {app.category} · {formatSize(app.currentVersion.sizeBytes)}
            {app.isOpenSource ? ' · Open source' : ''}
          </Text>
          <View className="mt-1">
            <StarRating value={app.avgRating} />
          </View>
        </View>
      </View>

      <View className="px-4 mt-4">
        <Button
          label={installLabel}
          size="lg"
          loading={install.status === 'downloading'}
          variant={install.status === 'error' ? 'danger' : 'primary'}
          onPress={install.status === 'installed' ? undefined : handleInstall}
          accessibilityHint={
            install.status === 'downloading' ? `${install.progress ?? 0} percent complete` : undefined
          }
        />
      </View>

      <View className="px-4 mt-6">
        <Text className="text-base font-semibold text-text mb-1">About</Text>
        <Text className="text-sm text-text-muted leading-5">
          {app.longDescription ?? app.shortDescription}
        </Text>
      </View>

      <View className="px-4 mt-6">
        <Text className="text-base font-semibold text-text mb-2">
          Reviews ({reviews.length})
        </Text>
        {reviews.length === 0 ? (
          <Text className="text-sm text-text-muted">No reviews yet.</Text>
        ) : (
          reviews.map((r) => (
            <View key={r.id} className="mb-3">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-medium text-text">{r.userDisplayName}</Text>
                <StarRating value={r.rating} showLabel={false} size={12} />
              </View>
              {r.comment ? (
                <Text className="text-sm text-text-muted mt-0.5">{r.comment}</Text>
              ) : null}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
