import CategoryModel from '@/models/category.model';
import OfferModel from '@/models/offer.model';
import PlaceLocation from '@/models/place-location.model';

interface PlaceModel {
  id: string;
  name: string;
  description?: string;
  category: CategoryModel;
  photo: string;
  logo?: string;
  website?: string;
  locations: PlaceLocation[];
  offers: OfferModel[];
}

export default PlaceModel;
