import { FC, memo, ReactNode } from 'react';

export interface FetchViewProps {
  children: ReactNode;
  empty: ReactNode;
  loading: ReactNode;
  isEmpty: boolean;
  isLoading: boolean;
}

const FetchView: FC<FetchViewProps> = ({
  children,
  empty,
  loading,
  isLoading,
  isEmpty,
}) => (isLoading && isEmpty ? loading : isEmpty ? empty : children);

export default memo(FetchView);
