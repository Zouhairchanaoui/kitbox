import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { AppCard } from '../../components/AppCard';
import { AppCardSkeletonGrid } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import { getApps } from '../../lib/data';
import type { AppCategory, KitboxApp } from '../../lib/types';

const CATEGORIES: { key: AppCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'media', label: 'Media' },
  { key: 'social', label: 'Social' },
];

// S02 — Store / main feed. Core loop (F01) starts here: tap a card to
// reach S04, then install.
export default function StoreScreen() {
  const [apps, setApps] = useState<KitboxApp[] | null>(null);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState<AppCategory | 'all'>('all');

  const load = useCallback(async (cat: AppCategory | 'all') => {
    setError(false);
    setApps(null);
    try {
      const result = await getApps(cat === 'all' ? undefined : { category: cat });
      setApps(result);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    load(category);
  }, [category, load]);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-row items-center justify-between px-4 pt-2 pb-3">
        <Text className="text-xl font-bold text-text">Kitbox</Text>
        <Pressable
          onPress={() => router.push('/search')}
          accessibilityRole="button"
          accessibilityLabel="Search"
          className="w-10 h-10 rounded-full bg-surface items-center justify-center"
        >
          <Search size={20} color="#1c1830" />
        </Pressable>
      </View>

      <View
        className="flex-row gap-2 px-4 mb-3"
        accessibilityRole="radiogroup"
      >
        {CATEGORIES.map((c) => {
          const selected = c.key === category;
          return (
            <Pressable
              key={c.key}
              onPress={() => setCategory(c.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              className={`h-8 px-3 rounded-pill justify-center ${
                selected ? 'bg-accent' : 'bg-surface border border-border'
              }`}
            >
              <Text className={`text-xs font-medium ${selected ? 'text-on-accent' : 'text-text-muted'}`}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <EmptyState
          heading="Can't reach Kitbox right now"
          body="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => load(category)}
        />
      ) : apps === null ? (
        <AppCardSkeletonGrid />
      ) : apps.length === 0 ? (
        <EmptyState heading="Nothing here yet" body="Try a different category." />
      ) : (
        <FlatList
          data={apps}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerClassName="px-4 gap-3"
          columnWrapperClassName="gap-3"
          renderItem={({ item }) => (
            <AppCard app={item} onPress={() => router.push(`/app/${item.id}`)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
