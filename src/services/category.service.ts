import CategoryModel from '@/models/category.model';
import HttpService from '@/services/http.service';

const CategoryService = {
  /**
   * All categories, sorted by their admin-defined order.
   * `enabled`: `true` (API default) | `false` | `'all'`.
   */
  list: async (enabled?: boolean | 'all'): Promise<CategoryModel[]> => {
    const query = enabled === undefined ? '' : `?enabled=${enabled}`;
    const { data } = await HttpService.get<{ data: CategoryModel[] }>(
      `/categories${query}`,
    );
    return data;
  },
};

export default CategoryService;
