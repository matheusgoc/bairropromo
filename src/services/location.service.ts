import PlaceModel from '@/models/place.model';
import PlaceLocationModel from '@/models/place-location.model';
import HttpService from '@/services/http.service';

export interface LocationPayload {
  name: string;
  city: string;
  state: string;
  address: string;
  postalCode: string;
  phone?: string;
  isWhatsapp?: boolean;
  email?: string;
  workingHours: { weekDay: string; start: string; end: string }[];
}

const placePath = (placeId: string) => `/places/${encodeURIComponent(placeId)}`;

const locationsPath = (placeId: string, locationId?: string) =>
  `${placePath(placeId)}/locations${
    locationId ? `/${encodeURIComponent(locationId)}` : ''
  }`;

const LocationService = {
  /**
   * Locations aren't paginated: they come in the place preview's
   * `locations` attribute (soft-deleted ones left out).
   */
  list: async (placeId: string): Promise<PlaceLocationModel[]> => {
    const { locations } = await HttpService.get<PlaceModel>(placePath(placeId));
    return locations ?? [];
  },

  get: async (
    placeId: string,
    locationId: string,
  ): Promise<PlaceLocationModel> =>
    HttpService.get<PlaceLocationModel>(locationsPath(placeId, locationId)),

  add: async (
    placeId: string,
    location: LocationPayload,
  ): Promise<PlaceLocationModel> =>
    HttpService.post<PlaceLocationModel>(locationsPath(placeId), location),

  /** Full replacement: omitted optional fields are cleared by the API. */
  update: async (
    placeId: string,
    locationId: string,
    location: LocationPayload,
  ): Promise<PlaceLocationModel> =>
    HttpService.put<PlaceLocationModel>(
      locationsPath(placeId, locationId),
      location,
    ),

  /** Soft delete on the API side. */
  remove: async (placeId: string, locationId: string): Promise<void> =>
    HttpService.delete<void>(locationsPath(placeId, locationId)),
};

export default LocationService;
