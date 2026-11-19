import { File, UploadType } from 'expo-file-system';

import ListModel from '@/models/list.model';
import PlaceOwnerModel from '@/models/place-owner.model';
import PlaceModel from '@/models/place.model';
import HttpService, { HttpError } from '@/services/http.service';

export interface PlacePayload {
  name: string;
  description?: string;
  website?: string;
  category?: string;
}

export type PlaceImageType = 'logo' | 'photo';

// Image formats the API accepts for place photo/logo uploads
export type PlaceImageContentType = 'image/jpeg' | 'image/png' | 'image/webp';

// Presigned upload issued by `PATCH /places/{id}/images/{type}`
export interface PlaceImageUpload {
  uploadUrl: string; // short-lived presigned S3 PUT URL
  draftUrl: string; // public URL of the uploaded image, already set as the place's draft
  expiresIn: number; // seconds until uploadUrl expires
}

export interface PlaceServiceFilter {
  published?: 'all' | boolean; // default true
  position?: {
    lat: number;
    lon: number;
  };
}

const toPlaceBody = (data: PlacePayload): PlacePayload => ({
  name: data.name.trim(),
  category: data.category?.trim() || undefined,
  description: data.description?.trim() || undefined,
  website: data.website?.trim() || undefined,
});

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

  add: async (data: PlacePayload): Promise<PlaceModel> =>
    HttpService.post<PlaceModel>('/places', toPlaceBody(data)),

  update: async (id: string, data: PlacePayload): Promise<PlaceModel> =>
    HttpService.put<PlaceModel>(
      `/places/${encodeURIComponent(id)}`,
      toPlaceBody(data),
    ),

  publish: async (id: string): Promise<void> =>
    HttpService.patch<void>(`/places/${encodeURIComponent(id)}/publish`),

  unpublish: async (id: string): Promise<void> =>
    HttpService.patch<void>(`/places/${encodeURIComponent(id)}/unpublish`),

  listOwners: async (placeId: string): Promise<PlaceOwnerModel[]> => {
    const { data } = await HttpService.get<{ data: PlaceOwnerModel[] }>(
      `/places/${encodeURIComponent(placeId)}/owners`,
    );

    return data;
  },

  findOwner: async (placeId: string, email: string): Promise<PlaceOwnerModel> =>
    HttpService.patch<PlaceOwnerModel>(
      `/places/${encodeURIComponent(placeId)}/owners/find`,
      { email: email.trim() },
    ),

  grantOwner: async (placeId: string, ownerId: string): Promise<void> =>
    HttpService.patch<void>(`/places/${encodeURIComponent(placeId)}/grant`, {
      owner: ownerId,
    }),

  revokeOwner: async (placeId: string, ownerId: string): Promise<void> =>
    HttpService.patch<void>(`/places/${encodeURIComponent(placeId)}/revoke`, {
      owner: ownerId,
    }),

  /**
   * Issues a presigned S3 PUT URL for a new photo/logo
   * The API records the returned `draftUrl` as the place's `draftPhoto`/`draftLogo` right away
   */
  requestImageUpload: async (
    placeId: string,
    type: PlaceImageType,
    contentType: PlaceImageContentType,
  ): Promise<PlaceImageUpload> =>
    HttpService.patch<PlaceImageUpload>(
      `/places/${encodeURIComponent(placeId)}/images/${type}`,
      { contentType },
    ),

  /**
   * Uploads a local image as the place's draft photo/logo and resolves with its draft URL
   * The live `photo`/`logo` only changes once it's approved
   */
  uploadImage: async (
    placeId: string,
    imageUri: string,
    type: PlaceImageType,
    contentType: PlaceImageContentType,
  ): Promise<string> => {
    const { uploadUrl, draftUrl } = await PlaceService.requestImageUpload(
      placeId,
      type,
      contentType,
    );

    // Straight to S3
    const { status, body } = await new File(imageUri).upload(uploadUrl, {
      httpMethod: 'PUT',
      uploadType: UploadType.BINARY_CONTENT,
      // content type must match what the API was asked for
      headers: { 'Content-Type': contentType },
      sessionType: 'foreground',
    });

    // `upload` resolves for any completed response, including non-2xx.
    if (status < 200 || status >= 300) {
      throw new HttpError(status, `HTTP ${status}`, body);
    }

    return draftUrl;
  },
};

export default PlaceService;
