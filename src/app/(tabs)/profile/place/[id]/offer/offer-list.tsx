import { useInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { FC, memo, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Divider,
  Icon,
  List as RNPList,
  Text,
  useTheme,
} from 'react-native-paper';

import EmptyState from '@/components/ui/empty-state';
import List from '@/components/ui/list';
import OfferStatusBadge from '@/components/ui/offer-status-badge';
import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import { extractInitials } from '@/helpers';
import OfferModel from '@/models/offer.model';
import OfferService from '@/services/offer.service';

interface OfferProps {
  offer: Partial<OfferModel>;
}

const Offer: FC<OfferProps> = memo(({ offer }) => {
  const styles = usePlaceStyles(offer?.status ?? 'active');
  const editOffer = () => {
    router.navigate({
      pathname: '../../[id]/offer/[offerId]/offer-form',
      params: { id: offer.place?.id, offerId: offer.id },
    });
  };

  return (
    <View>
      <RNPList.Item
        title={
          <View>
            <Text variant="titleMedium">{offer.place?.name}</Text>
            <Text variant="titleSmall">
              {offer.location
                ? `${offer.location.name} | ${offer.location.city} - ${offer.location.state}`
                : 'Todas as unidades'}
            </Text>
          </View>
        }
        titleNumberOfLines={2}
        description={offer.title}
        descriptionNumberOfLines={4}
        containerStyle={styles.container}
        contentStyle={styles.content}
        titleStyle={styles.title}
        left={() =>
          offer.place?.logo ? (
            <Image
              source={offer.place.logo}
              contentFit="cover"
              transition={1000}
              alt={`Logo de ${offer.place.name}.`}
              style={styles.logo}
            />
          ) : (
            <Avatar.Text
              size={50}
              label={extractInitials(offer.place?.name)}
              style={styles.avatar}
            />
          )
        }
        right={() => <RNPList.Icon icon="chevron-right" />}
        onPress={editOffer}
      />
      {offer.end && (
        <Text variant="labelSmall" style={styles.expiration}>
          Válido até {dayjs(offer.end).format('DD/MM/YYYY [às] hh:mm')}.
        </Text>
      )}
      {offer.status && offer.status !== 'active' ? (
        <OfferStatusBadge status={offer.status} />
      ) : null}
      <Divider />
    </View>
  );
});

Offer.displayName = 'Offer';

const usePlaceStyles = (status: OfferModel['status']) => {
  const theme = useTheme();
  return StyleSheet.create({
    logo: {
      width: 50,
      height: 50,
      borderRadius: 50,
      opacity: status === 'active' ? 1 : 0.5,
    },
    avatar: {
      opacity: status === 'active' ? 1 : 0.5,
    },
    container: {
      marginLeft: 10,
    },
    content: {
      opacity: status === 'active' ? 1 : 0.5,
    },
    title: {
      marginBottom: 10,
    },
    qrcodeIcon: {
      padding: 15,
    },
    expiration: {
      marginLeft: 75,
      paddingBottom: 10,
      fontWeight: 'bold',
      color: theme.colors.tertiary,
      opacity: status === 'active' ? 1 : 0.5,
    },
  });
};

const OfferList: FC = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const {
    data,
    isPending,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['offers', id],
    queryFn: ({ pageParam }) => OfferService.list(pageParam, id),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const offers = data?.pages.flatMap((page) => page.data) ?? [];

  const handleInfiniteScroll = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <List
      data={offers}
      hasNextPage={!!hasNextPage}
      keyExtractor={(offer) => offer.id}
      renderItem={({ item }: { item: OfferModel }) => <Offer offer={item} />}
      onEndReached={handleInfiniteScroll}
      onRefresh={handleRefresh}
      isLoading={isPending || isRefetching}
      loading={<LoadingSkeleton />}
      isEmpty={offers.length === 0}
      empty={<EmptyState title="Nenhum oferta assinada!" />}
    />
  );
};

const LoadingSkeleton: FC = memo(() => {
  const theme = useTheme();
  return (
    <ScrollView>
      {Array.from({ length: 15 }).map((_, i) => (
        <View key={i}>
          <View style={{ flexDirection: 'row', gap: 10, margin: 10 }}>
            <SkeletonCircle size={50} />
            <View style={{ gap: 5, width: '70%' }}>
              <SkeletonText width="60%" height={20} />
              <SkeletonText width="100%" height={10} />
              <SkeletonText width="80%" height={10} />
              <SkeletonText width="60%" height={10} />
            </View>
            <View style={{ alignSelf: 'center' }}>
              <Icon source="qrcode" size={25} color={theme.colors.outline} />
            </View>
          </View>
          <Divider />
        </View>
      ))}
    </ScrollView>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default OfferList;
