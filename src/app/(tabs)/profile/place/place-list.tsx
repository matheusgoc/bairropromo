import { useInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FC, memo, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Badge, Divider, List as RNPList } from 'react-native-paper';

import EmptyState from '@/components/ui/empty-state';
import List from '@/components/ui/list';
import PlaceStatusBadge from '@/components/ui/place-status-badge';
import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import { extractInitials } from '@/helpers';
import useAppTheme from '@/hooks/use-app-theme';
import PlaceModel, { PlaceStatus } from '@/models/place.model';
import PlaceService, { PlaceServiceFilter } from '@/services/place.service';
import { DefaultTheme } from '@/types';

const filter: PlaceServiceFilter = { published: 'all' };

const PlaceList: FC = () => {
  const {
    data,
    isPending,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['places', filter],
    queryFn: ({ pageParam: cursor }) => PlaceService.list(cursor, filter),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor : undefined,
  });

  const places = data?.pages.flatMap((page) => page.data) ?? [];

  const handleInfiniteScroll = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <View>
      <List
        data={places}
        hasNextPage={!!hasNextPage}
        keyExtractor={(place: PlaceModel) => place.id}
        renderItem={({ item }: { item: PlaceModel }) => (
          <PlaceItem place={item} />
        )}
        onEndReached={handleInfiniteScroll}
        onRefresh={handleRefresh}
        isLoading={isPending || isRefetching}
        loading={<LoadingSkeleton />}
        isEmpty={places.length === 0}
        empty={
          <EmptyState
            title="Nenhum local encontrado"
            subtitle="Você não possui nenhum local cadastrado ainda."
          />
        }
      />
    </View>
  );
};

interface PlaceItemProps {
  place: PlaceModel;
}

const PlaceItem: FC<PlaceItemProps> = memo(({ place }) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const handlePress = () => {
    router.navigate({
      pathname: '/profile/place/[id]/place-view',
      params: { id: place.id },
    });
  };

  return (
    <RNPList.Item
      title={place.name}
      titleNumberOfLines={1}
      description={() => (
        <View style={styles.description}>
          <Text style={styles.category}>{place.category?.name}</Text>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            {![PlaceStatus.ACTIVE, PlaceStatus.DRAFT].includes(
              place.status,
            ) && <PlaceStatusBadge status={place.status} />}
          </View>
        </View>
      )}
      onPress={handlePress}
      left={() =>
        place.logo ? (
          <Image
            source={place.logo}
            style={styles.logo}
            contentFit="cover"
            alt={`Logo de ${place.name}`}
          />
        ) : (
          <Avatar.Text
            size={50}
            label={extractInitials(place.name)}
            style={styles.logo}
          />
        )
      }
      right={() => (
        <View style={styles.right}>
          <Badge
            style={{
              backgroundColor: place.published
                ? theme.colors.success
                : theme.colors.error,
            }}
          />
          <RNPList.Icon icon="chevron-right" />
        </View>
      )}
      style={styles.item}
    />
  );
});

PlaceItem.displayName = 'PlaceItem';

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    item: {
      backgroundColor: theme.colors.surface,
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 50,
      margin: 8,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
    description: {
      gap: 4,
      alignItems: 'flex-start',
    },
    category: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
  });

const LoadingSkeleton: FC = memo(() => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  return (
    <ScrollView>
      {Array.from({ length: 15 }).map((_, i) => (
        <View key={i}>
          <View style={{ flexDirection: 'row', gap: 10, margin: 10 }}>
            <SkeletonCircle size={50} />
            <View style={{ gap: 10, width: '70%', justifyContent: 'center' }}>
              <SkeletonText width="60%" height={16} />
              <SkeletonText width="100%" height={10} />
            </View>
            <View style={{ alignSelf: 'center' }}>
              <View style={styles.right}>
                <Badge
                  style={{ backgroundColor: theme.colors.surfaceVariant }}
                />
                <RNPList.Icon icon="chevron-right" />
              </View>
            </View>
          </View>
          <Divider />
        </View>
      ))}
    </ScrollView>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default PlaceList;
