import PlaceModel from '@/models/place.model';

interface OfferModel {
  id: string;
  title: string;
  discount?: number;
  start?: string;
  end?: string;
  isActive: boolean;
  place?: Pick<PlaceModel, 'id' | 'name' | 'logo'>;
}

export default OfferModel;
