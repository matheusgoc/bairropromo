import type { TimeOfDay } from '@/types';

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

/** Time-of-day applied to an offer's start when the user picks no time. */
export const START_OF_DAY: TimeOfDay = { hours: 0, minutes: 0, seconds: 0 };

/** Time-of-day applied to an offer's end when the user picks no time. */
export const END_OF_DAY: TimeOfDay = { hours: 23, minutes: 59, seconds: 59 };
