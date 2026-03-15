import OfferModel from '@/models/offer.model';
import PlaceLocation from '@/models/place-location.model';

interface PlaceModel {
  id: string;
  name: string;
  description?: string;
  category: string;
  photo: string;
  logo?: string;
  website?: string;
  locations: PlaceLocation[];
  offers: OfferModel[];
}

export default PlaceModel;
