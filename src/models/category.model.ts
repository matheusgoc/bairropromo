interface CategoryModel {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  order: number;
}

export default CategoryModel;
