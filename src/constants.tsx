export const CATEGORIES = [
  {
    id: '1',
    name: 'Alimentação e Bebidas',
    description:
      'Restaurante, cafeteria, padaria, bar, lanchonete, food truck, sorveteria',
  },
  {
    id: '2',
    name: 'Varejo e Compras',
    description:
      'Loja de sapatos, loja de roupas, supermercado, loja de eletrônicos, farmácia, livraria',
  },
  {
    id: '3',
    name: 'Saúde e Bem-estar',
    description:
      'Academia, hospital, clínica, dentista, spa, estúdio de yoga, fisioterapia',
  },
  {
    id: '4',
    name: 'Beleza e Estética',
    description:
      'Salão de beleza, cabeleireiro, manicure, spa, estúdio de maquiagem, barbearia',
  },
  {
    id: '5',
    name: 'Entretenimento',
    description:
      'Cinema, teatro, casa de shows, parque de diversões, fliperama, boate, museu',
  },
  {
    id: '6',
    name: 'Esportes e Fitness',
    description:
      'Clube esportivo, academia, piscina, estádio, quadra de tênis, dojo de artes marciais',
  },
  {
    id: '7',
    name: 'Automotivo e Reparos',
    description:
      'Oficina mecânica, auto-elétrica, lava-rápido, funilaria/pintura, pneus/bateria',
  },
  {
    id: '8',
    name: 'Serviços Gerais',
    description: 'Lavanderia, elétrica, encanamento, pintor',
  },
  {
    id: '9',
    name: 'Educação',
    description:
      'Escola, universidade, centro de treinamento, biblioteca, escola de idiomas',
  },
  {
    id: '10',
    name: 'Profissionais',
    description:
      'Escritório de advocacia, contador, imobiliária, consultoria, agência de marketing',
  },
  {
    id: '11',
    name: 'Hospitalidade',
    description:
      'Hotel, pousada, camping, aluguel de temporada, salão de festas',
  },
  {
    id: '12',
    name: 'Transporte',
    description:
      'Posto de gasolina, locadora de carros, ponto de táxi, oficina de bikes, estacionamento',
  },
];

export const BRAZIL_STATES = [
  { id: 'AC', name: 'AC - Acre' },
  { id: 'AL', name: 'AL - Alagoas' },
  { id: 'AP', name: 'AP - Amapá' },
  { id: 'AM', name: 'AM - Amazonas' },
  { id: 'BA', name: 'BA - Bahia' },
  { id: 'CE', name: 'CE - Ceará' },
  { id: 'DF', name: 'DF - Distrito Federal' },
  { id: 'ES', name: 'ES - Espírito Santo' },
  { id: 'GO', name: 'GO - Goiás' },
  { id: 'MA', name: 'MA - Maranhão' },
  { id: 'MT', name: 'MT - Mato Grosso' },
  { id: 'MS', name: 'MS - Mato Grosso do Sul' },
  { id: 'MG', name: 'MG - Minas Gerais' },
  { id: 'PA', name: 'PA - Pará' },
  { id: 'PB', name: 'PB - Paraíba' },
  { id: 'PR', name: 'PR - Paraná' },
  { id: 'PE', name: 'PE - Pernambuco' },
  { id: 'PI', name: 'PI - Piauí' },
  { id: 'RJ', name: 'RJ - Rio de Janeiro' },
  { id: 'RN', name: 'RN - Rio Grande do Norte' },
  { id: 'RS', name: 'RS - Rio Grande do Sul' },
  { id: 'RO', name: 'RO - Rondônia' },
  { id: 'RR', name: 'RR - Roraima' },
  { id: 'SC', name: 'SC - Santa Catarina' },
  { id: 'SP', name: 'SP - São Paulo' },
  { id: 'SE', name: 'SE - Sergipe' },
  { id: 'TO', name: 'TO - Tocantins' },
];

export const DATE_MASK = [
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const DATETIME_MASK = [
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  ':',
  /\d/,
  /\d/,
];
