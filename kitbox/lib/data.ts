// Fake data layer — function signatures match the real API routes in
// replica/architecture.md (GET /api/apps, GET /api/apps/:id, etc.) so that
// swapping this file for real fetch() calls against Supabase changes no
// screen code. Seed data is original to this project — no names, icons,
// descriptions or copy borrowed from Appteka.

import type { KitboxApp, Review } from './types';

const seedApps: KitboxApp[] = [
  {
    id: 'app-1',
    ownerId: 'user-1',
    name: 'Scribble Notes',
    packageName: 'app.kitbox.scribble',
    shortDescription: 'Quick handwritten notes with a pressure-sensitive pen',
    longDescription:
      'Scribble Notes turns your finger or stylus into a fast notebook. Notebooks sync across your devices and export to plain text or PDF whenever you want.',
    category: 'productivity',
    isOpenSource: true,
    iconUrl: null,
    currentVersion: {
      id: 'v-1',
      appId: 'app-1',
      versionName: '3.2.0',
      versionCode: 32,
      changelog: 'Faster sync, smaller download size.',
      apkUrl: 'https://cdn.example.com/scribble-3.2.0.apk',
      sizeBytes: 18_400_000,
      scanStatus: 'clean',
      uploadedAt: '2026-10-02T10:00:00Z',
    },
    avgRating: 4.6,
    ratingCount: 212,
    downloadCount: 15_300,
  },
  {
    id: 'app-2',
    ownerId: 'user-2',
    name: 'Tidelog',
    packageName: 'app.kitbox.tidelog',
    shortDescription: 'Offline-first habit and mood tracker',
    longDescription:
      'Tidelog keeps a private, offline log of habits and mood. Nothing leaves your device unless you choose to export a backup.',
    category: 'productivity',
    isOpenSource: true,
    iconUrl: null,
    currentVersion: {
      id: 'v-2',
      appId: 'app-2',
      versionName: '1.9.4',
      versionCode: 19,
      changelog: 'Fixed a crash on the weekly summary screen.',
      apkUrl: 'https://cdn.example.com/tidelog-1.9.4.apk',
      sizeBytes: 9_100_000,
      scanStatus: 'clean',
      uploadedAt: '2026-09-18T10:00:00Z',
    },
    avgRating: 4.8,
    ratingCount: 540,
    downloadCount: 41_000,
  },
  {
    id: 'app-3',
    ownerId: 'user-3',
    name: 'Fretwork',
    packageName: 'app.kitbox.fretwork',
    shortDescription: 'A guitar tuner and metronome, no ads',
    longDescription:
      'Fretwork listens through the mic, tunes six or twelve strings, and keeps time with a metronome that actually feels musical.',
    category: 'media',
    isOpenSource: false,
    iconUrl: null,
    currentVersion: {
      id: 'v-3',
      appId: 'app-3',
      versionName: '2.0.1',
      versionCode: 20,
      changelog: 'Added drop-D and open-G presets.',
      apkUrl: 'https://cdn.example.com/fretwork-2.0.1.apk',
      sizeBytes: 6_700_000,
      scanStatus: 'clean',
      uploadedAt: '2026-11-01T10:00:00Z',
    },
    avgRating: 4.3,
    ratingCount: 88,
    downloadCount: 7_600,
  },
  {
    id: 'app-4',
    ownerId: 'user-4',
    name: 'Portside',
    packageName: 'app.kitbox.portside',
    shortDescription: 'A calm, single-column RSS reader',
    longDescription:
      'Portside pulls your feeds on a schedule you set and shows them one column, one story at a time — no infinite scroll.',
    category: 'social',
    isOpenSource: true,
    iconUrl: null,
    currentVersion: {
      id: 'v-4',
      appId: 'app-4',
      versionName: '0.8.0',
      versionCode: 8,
      changelog: 'Early release.',
      apkUrl: 'https://cdn.example.com/portside-0.8.0.apk',
      sizeBytes: 4_200_000,
      scanStatus: 'pending',
      uploadedAt: '2026-11-10T10:00:00Z',
    },
    avgRating: 4.1,
    ratingCount: 14,
    downloadCount: 900,
  },
];

const seedReviews: Record<string, Review[]> = {
  'app-1': [
    {
      id: 'r-1',
      appId: 'app-1',
      userId: 'user-9',
      userDisplayName: 'marta_k',
      rating: 5,
      comment: 'Replaced three other note apps for me.',
      createdAt: '2026-10-20T12:00:00Z',
    },
  ],
  'app-2': [
    {
      id: 'r-2',
      appId: 'app-2',
      userId: 'user-10',
      userDisplayName: 'ohashi',
      rating: 5,
      comment: 'Simple and it stays out of the way.',
      createdAt: '2026-09-25T12:00:00Z',
    },
  ],
};

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// GET /api/apps
export async function getApps(params?: { category?: string }): Promise<KitboxApp[]> {
  const list = params?.category
    ? seedApps.filter((a) => a.category === params.category)
    : seedApps;
  return delay(list);
}

// GET /api/apps/search?q=
export async function searchApps(query: string): Promise<KitboxApp[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay([]);
  return delay(
    seedApps.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.shortDescription.toLowerCase().includes(q)
    )
  );
}

// GET /api/apps/:id
export async function getApp(id: string): Promise<KitboxApp | null> {
  return delay(seedApps.find((a) => a.id === id) ?? null);
}

// GET /api/apps/:id/reviews
export async function getReviews(appId: string): Promise<Review[]> {
  return delay(seedReviews[appId] ?? []);
}

// POST /api/apps/:id/download — simulates a download; caller drives the
// progress UI by polling or, here, by awaiting the resolved promise.
export async function downloadApp(
  appId: string,
  onProgress: (pct: number) => void
): Promise<{ downloadUrl: string }> {
  for (let pct = 0; pct <= 100; pct += 20) {
    onProgress(pct);
    // eslint-disable-next-line no-await-in-loop
    await delay(null, 150);
  }
  const app = seedApps.find((a) => a.id === appId);
  return { downloadUrl: app?.currentVersion.apkUrl ?? '' };
}

// In-memory favorites for the vertical slice, before real auth/DB exist.
const favoriteIds = new Set<string>();

export async function toggleFavorite(appId: string): Promise<{ favorited: boolean }> {
  const next = !favoriteIds.has(appId);
  if (next) favoriteIds.add(appId);
  else favoriteIds.delete(appId);
  return delay({ favorited: next });
}

export async function getFavorites(): Promise<KitboxApp[]> {
  return delay(seedApps.filter((a) => favoriteIds.has(a.id)));
}

export function isFavorited(appId: string): boolean {
  return favoriteIds.has(appId);
}
