interface PromotionModel {
  id: string;
  title: string;
  discount?: number;
  start?: string;
  end?: string;
  isActive: boolean;
}

export default PromotionModel;
