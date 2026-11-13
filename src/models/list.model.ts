interface ListModel<Model> {
  data: Model[];
  meta: {
    take: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    nextCursor: string | null;
  };
}

export default ListModel;
