import { useInfiniteQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { FC, memo, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Icon, List as RNPList, useTheme } from 'react-native-paper';

import EmptyState from '@/components/ui/empty-state';
import List from '@/components/ui/list';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import PlaceLocationModel from '@/models/place-location.model';
import LocationService from '@/services/location.service';

interface LocationProps {
  location: PlaceLocationModel;
  placeId: string;
}

const Location: FC<LocationProps> = memo(({ location, placeId }) => {
  const navigateToForm = () => {
    router.navigate({
      pathname: '../../[id]/location/[locationId]/location-form',
      params: { id: placeId, locationId: location.id },
    });
  };

  return (
    <View>
      <RNPList.Item
        title={location.name}
        description={`${location.city} - ${location.state}`}
        left={() => <RNPList.Icon icon="map-marker" />}
        right={() => <RNPList.Icon icon="chevron-right" />}
        onPress={navigateToForm}
      />
      <Divider />
    </View>
  );
});

Location.displayName = 'Location';

const LocationList: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data,
    isPending,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['locations', id],
    queryFn: ({ pageParam }) => LocationService.list(pageParam, id),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const locations = data?.pages.flatMap((page) => page.data) ?? [];

  const handleInfiniteScroll = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <List
      data={locations}
      hasNextPage={!!hasNextPage}
      keyExtractor={(location) => location.id}
      renderItem={({ item }: { item: PlaceLocationModel }) => (
        <Location location={item} placeId={id} />
      )}
      onEndReached={handleInfiniteScroll}
      onRefresh={handleRefresh}
      isLoading={isPending || isRefetching}
      loading={<LoadingSkeleton />}
      isEmpty={locations.length === 0}
      empty={<EmptyState title="Nenhuma unidade cadastrada!" />}
    />
  );
};

const LoadingSkeleton: FC = memo(() => {
  const theme = useTheme();
  return (
    <ScrollView>
      {Array.from({ length: 15 }).map((_, i) => (
        <View key={i}>
          <View style={{ flexDirection: 'row', gap: 10, marginVertical: 20 }}>
            <View style={{ justifyContent: 'center' }}>
              <Icon
                source="map-marker"
                size={25}
                color={theme.colors.outline}
              />
            </View>
            <View style={{ gap: 5, width: '77%' }}>
              <SkeletonText width="60%" height={16} />
              <SkeletonText width="90%" height={12} />
            </View>
            <View style={{ alignSelf: 'center' }}>
              <Icon
                source="chevron-right"
                size={25}
                color={theme.colors.outline}
              />
            </View>
          </View>
          <Divider />
        </View>
      ))}
    </ScrollView>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LocationList;
