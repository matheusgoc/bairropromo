import ListModel from '@/models/list.model';
import PlaceModel from '@/models/place.model';

const mockPlace: PlaceModel = {
  id: '1',
  name: 'Sample Place 1',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pulvinar purus a eros suscipit, non tempor purus congue. Pellentesque sem lectus, dapibus id tempus nec, pulvinar vel enim. Quisque tristique dignissim tortor sit amet tincidunt. Proin ut leo tortor. Proin sed metus egestas sem malesuada facilisis. In id sodales elit, vitae sagittis massa. Praesent fringilla ex id lectus egestas lobortis. Nunc ut tincidunt nulla, eu faucibus neque. Praesent metus arcu, vulputate vel odio a, ornare tempus turpis.',
  category: 'Restaurante',
  photo: 'https://picsum.photos/200/300',
  logo: 'https://picsum.photos/200/300',
  city: 'São José do Vale do Rio Preto',
  state: 'MG',
  address: 'ZZZ 999 Bloco Z Loja 99',
  lat: '0.0000',
  lon: '0.0000',
  postalCode: '70070600',
  phone: '61 99999-9999',
  isWhatsapp: true,
  email: 'place@mockplace.com.br',
  website: 'https://mockplace.com.br',
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
  workingHours: [
    { weekDay: 'Segunda', start: '15:00', end: '23:00' },
    { weekDay: 'Terça', start: '15:00', end: '23:00' },
    { weekDay: 'Quarta', start: '15:00', end: '23:00' },
    { weekDay: 'Quinta', start: '15:00', end: '23:00' },
    { weekDay: 'Sexta', start: '15:00', end: '23:00' },
    { weekDay: 'Sábado', start: '15:00', end: '23:00' },
  ],
};

const PlaceService = {
  list: async (page: number): Promise<ListModel<PlaceModel>> => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      data: Array.from({ length: 20 }, (_, i) => ({
        ...mockPlace,
        id: `${page}-${i + 1}`,
        name: `Sample Place ${page}-${i + 1}`,
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
    };
  },

  add: async (placeData: any) => {
    // Logic to create a new place
  },

  update: async (id: string, placeData: any) => {
    // Logic to update an existing place
  },

  enable: async (id: string) => {
    // Logic to enable a place by its ID
  },

  disable: async (id: string) => {
    // Logic to disable a place by its ID
  },
};

export default PlaceService;
