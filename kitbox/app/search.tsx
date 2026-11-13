import { useState } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { EmptyState } from '../components/EmptyState';
import { searchApps } from '../lib/data';
import type { KitboxApp } from '../lib/types';

// S03 — Search. F02.
export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KitboxApp[] | null>(null);

  const onChange = async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults(null);
      return;
    }
    setResults(await searchApps(text));
  };

  return (
    <View className="flex-1 bg-bg px-4 pt-4">
      <View className="flex-row items-center h-11 bg-surface rounded-md px-3 gap-2">
        <SearchIcon size={18} color="#5e5774" />
        <TextInput
          value={query}
          onChangeText={onChange}
          placeholder="Search Kitbox"
          placeholderTextColor="#5e5774"
          accessibilityLabel="Search"
          autoFocus
          className="flex-1 text-base text-text"
        />
        {query.length > 0 ? (
          <X
            size={18}
            color="#5e5774"
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => onChange('')}
          />
        ) : null}
      </View>

      <View className="flex-1 mt-4">
        {results === null ? null : results.length === 0 ? (
          <EmptyState heading="Nothing matches that" />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerClassName="gap-2"
            renderItem={({ item }) => (
              <AppCard
                app={item}
                variant="list"
                onPress={() => router.push(`/app/${item.id}`)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}
