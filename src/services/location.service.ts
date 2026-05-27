import ListModel from '@/models/list.model';
import PlaceLocationModel from '@/models/place-location.model';

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

const mockCities: { city: string; state: string }[] = [
  { city: 'São José do Vale do Rio Preto', state: 'MG' },
  { city: 'Belo Horizonte', state: 'MG' },
  { city: 'Uberlândia', state: 'MG' },
  { city: 'Araguari', state: 'MG' },
  { city: 'São Paulo', state: 'SP' },
  { city: 'Rio de Janeiro', state: 'RJ' },
];

const mockLocationNames = [
  'Centro',
  'Ponte Nova',
  'Bom Jardim',
  'Shopping',
  'Norte',
  'Sul',
  'Leste',
  'Oeste',
  'Aeroporto',
  'Universitário',
];

const LocationService = {
  list: async (
    page: number,
    placeId: string,
  ): Promise<ListModel<PlaceLocationModel>> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      data: Array.from({ length: 20 }, (_, i) => {
        const idx = (page - 1) * 20 + i;
        const { city, state } = mockCities[idx % mockCities.length];
        return {
          id: ((page - 1) * 20 + i + 1).toString(),
          name: mockLocationNames[idx % mockLocationNames.length],
          city,
          state,
          address: `Rua Fictícia, ${idx + 1}`,
          postalCode: '70070-600',
          phone: `61 9${String(idx).padStart(4, '0')}-9999`,
          isWhatsapp: Math.random() > 0.5,
          workingHours: [
            { weekDay: 'Segunda', start: '09:00', end: '18:00' },
            { weekDay: 'Terça', start: '09:00', end: '18:00' },
            { weekDay: 'Quarta', start: '09:00', end: '18:00' },
            { weekDay: 'Quinta', start: '09:00', end: '18:00' },
            { weekDay: 'Sexta', start: '09:00', end: '18:00' },
          ],
        };
      }),
      meta: {
        page,
        take: page * 20,
        itemCount: 100,
        pageCount: 5,
        hasPreviousPage: page > 1,
        hasNextPage: page * 20 < 100,
      },
    };
  },

  get: async (
    placeId: string,
    locationId: string,
  ): Promise<PlaceLocationModel> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      id: locationId,
      name: 'Centro',
      city: 'São José do Vale do Rio Preto',
      state: 'MG',
      address: 'Rua Fictícia, 1',
      postalCode: '70070-600',
      phone: '61 99999-9999',
      isWhatsapp: true,
      workingHours: [
        { weekDay: 'Segunda', start: '09:00', end: '18:00' },
        { weekDay: 'Terça', start: '09:00', end: '18:00' },
        { weekDay: 'Quarta', start: '09:00', end: '18:00' },
        { weekDay: 'Quinta', start: '09:00', end: '18:00' },
        { weekDay: 'Sexta', start: '09:00', end: '18:00' },
      ],
    };
  },

  add: async (placeId: string, location: LocationPayload): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  update: async (
    placeId: string,
    locationId: string,
    location: LocationPayload,
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  remove: async (placeId: string, locationId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};

export default LocationService;
