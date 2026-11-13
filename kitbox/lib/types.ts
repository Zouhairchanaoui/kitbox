// Types mirror replica/schema.sql — keep them in sync by hand until
// replica-backend wires up a real generated client.

export type AppCategory =
  | 'tools'
  | 'games'
  | 'media'
  | 'productivity'
  | 'social'
  | 'other';

export interface AppVersion {
  id: string;
  appId: string;
  versionName: string;
  versionCode: number;
  changelog: string | null;
  apkUrl: string;
  sizeBytes: number;
  scanStatus: 'pending' | 'clean' | 'flagged';
  uploadedAt: string; // ISO
}

export interface KitboxApp {
  id: string;
  ownerId: string;
  name: string;
  packageName: string;
  shortDescription: string;
  longDescription: string | null;
  category: AppCategory;
  isOpenSource: boolean;
  iconUrl: string | null;
  currentVersion: AppVersion;
  avgRating: number; // 0–5
  ratingCount: number;
  downloadCount: number;
}

export interface Review {
  id: string;
  appId: string;
  userId: string;
  userDisplayName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  createdAt: string;
}

export interface InstallState {
  status: 'not-installed' | 'downloading' | 'installed' | 'update-available' | 'error';
  progress?: number; // 0–100, while downloading
}
