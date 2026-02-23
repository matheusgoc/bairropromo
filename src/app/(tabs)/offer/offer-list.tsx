import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Badge,
  Divider,
  Icon,
  List as RNPList,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/ui/empty-state';
import List from '@/components/ui/list';
import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import { extractInitials } from '@/helpers';
import OfferModel from '@/models/offer.model';
import OfferService from '@/services/offer.service';

const statusLabel: Record<OfferModel['status'], string> = {
  canceled: 'promoção cancelada',
  expired: 'promoção encerrada',
  used: 'promoção utilizada',
  active: 'ativa',
};

const StatusBadge = memo(({ status }: { status: OfferModel['status'] }) => {
  const theme = useTheme();
  return (
    <Badge
      style={{
        fontSize: 12,
        backgroundColor: theme.colors.outline,
        alignSelf: 'flex-start',
        marginHorizontal: 10,
        marginBottom: 10,
        marginLeft: 75,
        paddingHorizontal: 20,
      }}
    >
      {statusLabel[status]}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';

interface OfferProps {
  offer: Partial<OfferModel>;
}

const Offer: FC<OfferProps> = memo(({ offer }) => {
  const styles = usePlaceStyles(offer?.status ?? 'active');
  const showOfferCode = () => {
    router.navigate({
      pathname: '/offer/offer-code/[id]',
      params: { id: offer.id ?? 0, title: offer.title ?? '' },
    });
  };

  return (
    <View>
      <RNPList.Item
        title={offer.place?.name}
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
        right={() =>
          offer.status === 'active' ? (
            <RNPList.Icon icon="qrcode" style={styles.qrcodeIcon} />
          ) : undefined
        }
        onPress={showOfferCode}
      />
      {offer.status && offer.status !== 'active' ? (
        <StatusBadge status={offer.status} />
      ) : null}
      <Divider />
    </View>
  );
});

Offer.displayName = 'Offer';

const usePlaceStyles = (status: OfferModel['status']) => {
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
  });
};

const OfferList: FC = () => {
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<OfferModel[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const load = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const { data, meta } = await OfferService.list(page);
      setOffers((offers) => (page === 1 ? data : [...offers, ...data]));
      setHasNextPage(meta.hasNextPage);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load offers:', error);
      setLoading(false);
    }
  }, []);

  const handleInfiniteScroll = useCallback(async () => {
    if (loading || !hasNextPage) return;
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
    await load(page + 1);
  }, [hasNextPage, load, loading, page]);

  const refresh = useCallback(() => {
    setPage(1);
    load(1);
  }, [load]);

  useEffect(() => {
    load(1);
  }, [load]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <List
        data={offers}
        hasNextPage={hasNextPage}
        keyExtractor={(offer) => offer.id}
        renderItem={({ item }: { item: OfferModel }) => <Offer offer={item} />}
        onEndReached={handleInfiniteScroll}
        onRefresh={refresh}
        isLoading={loading}
        loading={<LoadingSkeleton />}
        isEmpty={offers.length === 0}
        empty={<EmptyState title="Nenhum oferta assinada!" />}
      />
    </SafeAreaView>
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
