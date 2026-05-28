import ListModel from '@/models/list.model';
import OfferModel from '@/models/offer.model';

export interface OfferPayload {
  title: string;
  start?: string;
  end?: string;
  locationId?: string;
}

const OfferService = {
  list: async (
    page: number,
    placeId?: string, // passed for profile offer list only
  ): Promise<ListModel<OfferModel>> => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // profile offer list has no used status offer
    const status = placeId
      ? ['expired', 'canceled'][Math.floor(Math.random() * 2)]
      : ['used', 'expired', 'canceled'][Math.floor(Math.random() * 3)];

    return {
      data: Array.from({ length: 20 }, (_, i) => ({
        id: ((page - 1) * 20 + i + 1).toString(),
        title: `Offer ${(page - 1) * 20 + i + 1} - Nulla congue nulla ligula, a porttitor erat tempus nec. Integer vel  vulputate, consectetur nisi sit amet, tellus`,
        description: `Description for offer ${(page - 1) * 20 + i + 1}`,
        discount: 10 + i,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: page > 1 ? (status as OfferModel['status']) : 'active',
        place: {
          id: placeId ?? (i + 1).toString(),
          name: placeId ? `Place ${placeId}` : `Place ${i + 1}`,
          logo: ['https://picsum.photos/200/300', undefined, 'expired'][
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
        page: page,
        take: page * 20,
        itemCount: 100,
        pageCount: 5,
        hasPreviousPage: page > 1,
        hasNextPage: page * 20 < 100,
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

  get: async (placeId: string, offerId: string): Promise<OfferModel> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      id: offerId,
      title: 'Oferta de exemplo',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    };
  },

  add: async (placeId: string, data: OfferPayload): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  update: async (
    placeId: string,
    offerId: string,
    data: OfferPayload,
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  disable: async (placeId: string, offerId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  enable: async (placeId: string, offerId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};

export default OfferService;
