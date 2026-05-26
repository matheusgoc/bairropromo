import ListModel from '@/models/list.model';
import PlaceLocationModel from '@/models/place-location.model';
import PlaceModel, { PlaceStatus } from '@/models/place.model';

const mockLoaction: PlaceLocationModel = {
  id: '1',
  name: 'Centro',
  city: 'São José do Vale do Rio Preto',
  state: 'MG',
  address: 'ZZZ 999 Bloco Z Loja 99',
  lat: '0.0000',
  lon: '0.0000',
  postalCode: '70070600',
  phone: '61 99999-9999',
  isWhatsapp: true,
  email: 'place@mockplace.com.br',
  workingHours: [
    { weekDay: 'Segunda', start: '15:00', end: '23:00' },
    { weekDay: 'Terça', start: '15:00', end: '23:00' },
    { weekDay: 'Quarta', start: '15:00', end: '23:00' },
    { weekDay: 'Quinta', start: '15:00', end: '23:00' },
    { weekDay: 'Sexta', start: '15:00', end: '23:00' },
    { weekDay: 'Sábado', start: '15:00', end: '23:00' },
  ],
  offers: [
    {
      id: '1',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      status: 'active',
    },
    {
      id: '2',
      title: 'Cras eu maximus velit.',
      status: 'active',
    },
    {
      id: '3',
      title:
        'Mauris at elit a orci fermentum scelerisque vestibulum vitae leo.',
      status: 'active',
    },
  ],
};

const mockPlace: PlaceModel = {
  id: '1',
  name: 'Sample Place 1',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pulvinar purus a eros suscipit, non tempor purus congue. Pellentesque sem lectus, dapibus id tempus nec, pulvinar vel enim. Quisque tristique dignissim tortor sit amet tincidunt. Proin ut leo tortor. Proin sed metus egestas sem malesuada facilisis. In id sodales elit, vitae sagittis massa. Praesent fringilla ex id lectus egestas lobortis. Nunc ut tincidunt nulla, eu faucibus neque. Praesent metus arcu, vulputate vel odio a, ornare tempus turpis.',
  category: { id: '1', name: 'Alimentação e Bebidas' },
  photo: 'https://picsum.photos/200/300',
  logo: 'https://picsum.photos/200/300',
  website: 'https://mockplace.com.br',
  status: PlaceStatus.ACTIVE,
  reason: '',
  published: true,
  locations: Array.from({ length: 3 }).map((_, i) => ({
    ...mockLoaction,
    id: i.toString(),
    name: ['Centro', 'Ponte Nova', 'Bom Jardim'][i],
  })),
  offers: [
    {
      id: '1',
      title:
        'Na compra de 1 prato ganhe 50% de desconto no segundo de menor valor.',
      status: 'active',
    },
    {
      id: '2',
      title: 'Compre 1 pizza e ganhe uma Coca-Cola grátis.',
      status: 'active',
    },
    {
      id: '3',
      title: 'Desconto de 20% em todas as sobremesas nas sextas-feiras.',
      status: 'active',
    },
  ],
};

export interface PlacePayload {
  name: string;
  description?: string;
  website?: string;
  category?: string;
}

export type PlaceImageType = 'logo' | 'photo';

export interface PlaceServiceFilter {
  ownerId?: string;
  position?: {
    lat: number;
    lon: number;
  };
}

const statuses = Object.values(PlaceStatus);

const PlaceService = {
  list: async (
    page: number,
    filter?: PlaceServiceFilter,
  ): Promise<ListModel<PlaceModel>> => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      data: Array.from({ length: 20 }, (_, i) => ({
        ...mockPlace,
        id: `${page}-${i + 1}`,
        name: `Sample Place ${page}-${i + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        published: Math.random() > 0.5,
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

  get: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      ...mockPlace,
      id,
      name: `Sample Place ${id}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      published: Math.random() > 0.5,
    };
  },

  add: async (data: PlacePayload) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  update: async (id: string, data: PlacePayload) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  publish: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  unpublish: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
