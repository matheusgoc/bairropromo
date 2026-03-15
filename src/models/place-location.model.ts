import OfferModel from '@/models/offer.model';

interface LocationWorkingHours {
  weekDay: string;
  start: string;
  end: string;
}

interface PlaceLocationModel {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  postalCode: string;
  lat?: string;
  lon?: string;
  phone?: string;
  isWhatsapp?: boolean;
  email?: string;
  workingHours: LocationWorkingHours[];
  offers?: OfferModel[];
}

export default PlaceLocationModel;
