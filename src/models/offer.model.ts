import PlaceLocationModel from '@/models/place-location.model';
import PlaceModel from '@/models/place.model';

interface OfferModel {
  id: string;
  title: string;
  discount?: number;
  start?: string;
  end?: string;
  status: 'expired' | 'used' | 'canceled' | 'active';
  place?: Pick<PlaceModel, 'id' | 'name' | 'logo'>;
  location?: Pick<PlaceLocationModel, 'id' | 'name' | 'city' | 'state'>;
}

export default OfferModel;
