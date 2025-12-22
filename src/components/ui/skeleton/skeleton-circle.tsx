import { Skeleton } from 'moti/skeleton';
import React, { memo } from 'react';
import { useColorScheme } from 'react-native';

interface Props {
  size?: number;
}

const SkeletonCircle = ({ size = 50 }: Props) => {
  const colorScheme = useColorScheme();
  const colorMode = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Skeleton colorMode={colorMode} width={size} height={size} radius="round" />
  );
};

export default memo(SkeletonCircle);
