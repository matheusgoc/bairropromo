import ListModel from '@/models/list.model';
import OfferModel from '@/models/offer.model';
import HttpService from '@/services/http.service';

export interface OfferPayload {
  title: string;
  discount?: number;
  /** ISO 8601 date-time with a timezone offset, e.g. 2026-10-31T23:59:59-03:00 */
  start?: string;
  /** ISO 8601 date-time with a timezone offset; must be after `start`. */
  end?: string;
  /** Sent as the `?location=` query param on add only: the API fixes it at creation. */
  locationId?: string;
}

const PAGE_SIZE = 20;

const offersPath = (placeId: string, offerId?: string) =>
  `/places/${encodeURIComponent(placeId)}/offers${
    offerId ? `/${encodeURIComponent(offerId)}` : ''
  }`;

const MOCK_PAGE_COUNT = 5;

const OfferService = {
  /** The place's offers, every status, newest first (owner/admin only). */
  list: async (
    placeId: string,
    cursor?: string,
  ): Promise<ListModel<OfferModel>> => {
    const params = new URLSearchParams({ take: String(PAGE_SIZE) });
    if (cursor) params.set('cursor', cursor);
    return HttpService.get<ListModel<OfferModel>>(
      `${offersPath(placeId)}?${params.toString()}`,
    );
  },

  /**
   * Mock: the customer's assigned offers. No API endpoint yet; the cursor is a
   * stringified page number.
   */
  listAssigned: async (cursor?: string): Promise<ListModel<OfferModel>> => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const page = Number(cursor ?? 1);
    const status = ['used', 'expired', 'canceled'][
      Math.floor(Math.random() * 3)
    ];

    return {
      data: Array.from({ length: PAGE_SIZE }, (_, i) => ({
        id: ((page - 1) * PAGE_SIZE + i + 1).toString(),
        title: `Offer ${(page - 1) * PAGE_SIZE + i + 1} - Nulla congue nulla ligula, a porttitor erat tempus nec. Integer vel  vulputate, consectetur nisi sit amet, tellus`,
        discount: 10 + i,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: page > 1 ? (status as OfferModel['status']) : 'active',
        place: {
          id: (i + 1).toString(),
          name: `Place ${i + 1}`,
          logo: ['https://picsum.photos/200/300', undefined][
            Math.floor(Math.random() * 2)
          ],
        },
        location:
          Math.random() < 0.5
            ? undefined
            : {
                id: (i + 1).toString(),
                name: `Location ${i + 1}`,
                city: [
                  'São José do Vale do Rio Preto',
                  'Belo Horizonte',
                  'Uberlândia',
                  'Araguari',
                ][Math.floor(Math.random() * 4)],
                state: 'MG',
              },
      })),
      meta: {
        take: PAGE_SIZE,
        hasPreviousPage: page > 1,
        hasNextPage: page < MOCK_PAGE_COUNT,
        nextCursor: page < MOCK_PAGE_COUNT ? String(page + 1) : null,
      },
    };
  },

  getCode: async (id: string): Promise<{ code: string; offer: OfferModel }> => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      code: Math.ceil(Math.random() * 1000000).toString(),
      offer: {
        id: '1',
        title:
          'Na compra de 1 prato ganhe 50% de desconto no segundo de menor valor.',
        discount: 10,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        place: {
          id: '1',
          name: 'Pão de Queijo da Vovó Zizi',
          logo:
            Math.random() < 0.5 ? 'https://picsum.photos/200/300' : undefined,
        },
        location:
          Math.random() < 0
            ? undefined
            : {
                id: '1',
                name: 'Coronel Francisco Limongi',
                city: 'São José do Vale do Rio Preto',
                state: 'MG',
              },
      },
    };
  },

  assign: async (id: string) => {
    // Logic to assign an offer to a user
  },

  unassign: async (id: string) => {
    // Logic to unassign an offer from a user
  },

  get: async (placeId: string, offerId: string): Promise<OfferModel> =>
    HttpService.get<OfferModel>(offersPath(placeId, offerId)),

  add: async (placeId: string, data: OfferPayload): Promise<OfferModel> => {
    const { locationId, ...body } = data;
    const query = locationId
      ? `?location=${encodeURIComponent(locationId)}`
      : '';
    return HttpService.post<OfferModel>(`${offersPath(placeId)}${query}`, body);
  },

  /** Full replacement of title/discount/start/end; the location can't change. */
  update: async (
    placeId: string,
    offerId: string,
    data: OfferPayload,
  ): Promise<OfferModel> => {
    const { locationId: _locationId, ...body } = data;
    return HttpService.put<OfferModel>(offersPath(placeId, offerId), body);
  },

  /** Cancels the offer (the API never deletes offers). */
  disable: async (placeId: string, offerId: string): Promise<OfferModel> =>
    HttpService.delete<OfferModel>(offersPath(placeId, offerId)),

  /**
   * Reactivates a canceled offer; its other fields are left untouched. The API
   * derives `expired` from `end`, so an offer whose end has passed comes back
   * expired.
   */
  enable: async (placeId: string, offerId: string): Promise<OfferModel> =>
    HttpService.patch<OfferModel>(offersPath(placeId, offerId)),
};

export default OfferService;
