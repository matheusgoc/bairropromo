import ListModel from '@/models/list.model';
import PlaceModel from '@/models/place.model';
import ProfileModel from '@/models/profile.model';
import HttpService from '@/services/http.service';

const mockSearchableOwners: ProfileModel[] = [
  {
    id: 'owner-1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: 'owner',
    subscriptionStatus: 'success',
  },
  {
    id: 'owner-2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    role: 'owner',
    subscriptionStatus: 'success',
  },
  {
    id: 'owner-3',
    name: 'Carlos Oliveira',
    email: 'carlos@exemplo.com',
    role: 'owner',
    subscriptionStatus: 'success',
  },
];

const mockPlaceOwners = new Map<string, ProfileModel[]>();

export interface PlacePayload {
  name: string;
  description?: string;
  website?: string;
  category?: string;
}

export type PlaceImageType = 'logo' | 'photo';

export interface PlaceServiceFilter {
  published?: 'all' | boolean; // default true
  position?: {
    lat: number;
    lon: number;
  };
}

const PlaceService = {
  list: async (
    cursor?: string,
    filter?: PlaceServiceFilter,
  ): Promise<ListModel<PlaceModel>> => {
    const params = new URLSearchParams();
    if (cursor) params.set('cursor', cursor);
    if (filter?.published !== undefined) {
      params.set('published', String(filter.published));
    }
    if (filter?.position) {
      params.set('lat', String(filter.position.lat));
      params.set('lon', String(filter.position.lon));
    }

    const query = params.toString();
    return HttpService.get<ListModel<PlaceModel>>(
      `/places${query ? `?${query}` : ''}`,
    );
  },

  get: async (id: string): Promise<PlaceModel> =>
    HttpService.get<PlaceModel>(`/places/${encodeURIComponent(id)}`),

  add: async (data: PlacePayload) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  update: async (id: string, data: PlacePayload) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  publish: async (id: string): Promise<void> =>
    HttpService.patch<void>(`/places/${encodeURIComponent(id)}/publish`),

  unpublish: async (id: string): Promise<void> =>
    HttpService.patch<void>(`/places/${encodeURIComponent(id)}/unpublish`),

  searchOwner: async (email: string): Promise<ProfileModel | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return (
      mockSearchableOwners.find(
        (o) => o.email.toLowerCase() === email.trim().toLowerCase(),
      ) ?? null
    );
  },

  listOwners: async (placeId: string): Promise<ProfileModel[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockPlaceOwners.get(placeId) ?? [];
  },

  associateOwner: async (placeId: string, ownerId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const owner = mockSearchableOwners.find((o) => o.id === ownerId);
    if (!owner) return;
    const current = mockPlaceOwners.get(placeId) ?? [];
    if (!current.find((o) => o.id === ownerId)) {
      mockPlaceOwners.set(placeId, [...current, owner]);
    }
  },

  disconnectOwner: async (placeId: string, ownerId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const current = mockPlaceOwners.get(placeId) ?? [];
    mockPlaceOwners.set(
      placeId,
      current.filter((o) => o.id !== ownerId),
    );
  },

  uploadImage: async (
    placeId: string,
    _imageUri: string,
    type: PlaceImageType,
  ): Promise<string> => {
    // Mock: simulate upload latency
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock: return a stable fake CDN URL.
    // ── Real API swap: replace this entire body with: ──────────────────────
    // const formData = new FormData();
    // formData.append('file', { uri: _imageUri, type: 'image/jpeg', name: `${type}.jpg` } as any);
    // const res = await fetch(`/api/places/${placeId}/images/${type}`, { method: 'POST', body: formData });
    // const json = await res.json();
    // return json.url;
    // ───────────────────────────────────────────────────────────────────────
    return `https://picsum.photos/seed/${placeId}-${type}-${Date.now()}/400/400`;
  },
};

export default PlaceService;
