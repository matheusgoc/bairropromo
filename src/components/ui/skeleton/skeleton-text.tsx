import { Skeleton } from 'moti/skeleton';
import React, { memo } from 'react';
import { DimensionValue, useColorScheme } from 'react-native';

interface Props {
  width?: DimensionValue; // Percentage, number, or 'auto'
  height: number; // Number (e.g., fontSize)
}

const SkeletonText = ({ width = '100%', height }: Props) => {
  const colorScheme = useColorScheme();
  const colorMode = colorScheme === 'dark' ? 'dark' : 'light';

  return <Skeleton colorMode={colorMode} width={width} height={height} />;
};

export default memo(SkeletonText);
