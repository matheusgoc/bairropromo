import PromotionModel from '@/models/promotion.model';

interface PlaceWorkingHours {
  weekDay: string;
  start: string;
  end: string;
}

interface PlaceModel {
  id: string;
  name: string;
  description?: string;
  category: string;
  photo: string;
  logo?: string;
  website?: string;
  city: string;
  state: string;
  address: string;
  postalCode: string;
  lat?: string;
  lon?: string;
  phone?: string;
  isWhatsapp?: boolean;
  email?: string;
  promotions: PromotionModel[];
  workingHours: PlaceWorkingHours[];
}

export default PlaceModel;
