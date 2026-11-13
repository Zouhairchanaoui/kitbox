import { Tabs } from 'expo-router';
import { Store, Heart, Upload, User } from 'lucide-react-native';

// components.md "Bottom navigation bar" — 4 tabs. Discussions/chat (S09)
// lives inside an app's detail screen, not its own tab slot, per recon.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6D28D9',
        tabBarInactiveTintColor: '#5e5774',
        tabBarStyle: { height: 56 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, size }) => <Upload color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
