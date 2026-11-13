import { useCallback, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { AppCard } from '../../components/AppCard';
import { EmptyState } from '../../components/EmptyState';
import { getFavorites } from '../../lib/data';
import type { KitboxApp } from '../../lib/types';

// S08 — Favorites. Re-fetches on focus so a favorite toggled on S02/S04
// shows up immediately (F05).
export default function FavoritesScreen() {
  const [apps, setApps] = useState<KitboxApp[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setApps);
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <Text className="text-xl font-bold text-text px-4 pt-2 pb-3">Favorites</Text>
      {apps === null ? null : apps.length === 0 ? (
        <EmptyState heading="Nothing saved yet" body="Apps you favorite will show up here." />
      ) : (
        <FlatList
          data={apps}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 gap-2"
          renderItem={({ item }) => (
            <AppCard app={item} variant="list" onPress={() => router.push(`/app/${item.id}`)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
