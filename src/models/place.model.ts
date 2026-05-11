import CategoryModel from '@/models/category.model';
import OfferModel from '@/models/offer.model';
import PlaceLocation from '@/models/place-location.model';

export enum PlaceStatus {
  DRAFT = 'draft',
  REVIEWING = 'reviewing',
  ACTIVE = 'active',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

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
  status: PlaceStatus;
  reason: string;
  published: boolean;
}

export default PlaceModel;
