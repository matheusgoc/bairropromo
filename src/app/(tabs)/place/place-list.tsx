import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/ui/empty-state';
import List from '@/components/ui/list';
import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import PlaceModel from '@/models/place.model';
import PlaceService from '@/services/place.service';
interface PlaceProps {
  place: Partial<PlaceModel>;
}

const Place: FC<PlaceProps> = memo(({ place }) => {
  const styles = usePlaceStyles();
  const moveToPlaceView = () => {
    router.navigate({
      pathname: '/place/place-view/[id]',
      params: { id: place.id ?? 0 },
    });
  };

  return (
    <Card style={styles.container}>
      <View style={{ minHeight: 15 }}>
        <Image
          source={place.photo}
          contentFit="cover"
          transition={1000}
          alt={`Foto de ${place.name}.`}
          style={{ height: 200 }}
        />
        {place.logo && (
          <Image
            source={place.logo}
            contentFit="cover"
            transition={1000}
            alt={`Logo de ${place.name}.`}
            style={styles.logo}
          />
        )}
      </View>
      <Card.Content style={styles.content}>
        <View>
          <Text variant="titleLarge">{place.name}</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text variant="bodySmall" style={{ marginBottom: 10 }}>
            Promoções
          </Text>
          {place.offers?.length === 0 ? (
            <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
              Nenhuma promoção no momento!
            </Text>
          ) : (
            place.offers?.slice(0, 3).map((p, i) => (
              <View key={p.id}>
                <Text variant="labelLarge">{p.title}</Text>
                {i < 2 ? <Divider style={{ marginVertical: 8 }} /> : null}
              </View>
            ))
          )}
        </View>
        <Button onPress={moveToPlaceView}>Ver mais</Button>
      </Card.Content>
    </Card>
  );
});

Place.displayName = 'Place';

const usePlaceStyles = () =>
  StyleSheet.create({
    container: { marginVertical: 25 },
    content: { marginTop: 16, gap: 8 },
    cover: { borderRadius: 0 },
    logo: {
      width: 70,
      height: 70,
      borderRadius: 50,
      position: 'absolute',
      right: 10,
      bottom: -20,
    },
  });

const PlaceList: FC = () => {
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<PlaceModel[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const load = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const { data, meta } = await PlaceService.list(page);
      setPlaces((places) => (page === 1 ? data : [...places, ...data]));
      setHasNextPage(meta.hasNextPage);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load places:', error);
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
        data={places}
        hasNextPage={hasNextPage}
        keyExtractor={(place) => place.id}
        renderItem={({ item }: { item: PlaceModel }) => <Place place={item} />}
        onEndReached={handleInfiniteScroll}
        onRefresh={refresh}
        isLoading={loading}
        loading={<LoadingSkeleton />}
        isEmpty={places.length === 0}
        empty={
          <EmptyState
            title="Nenhum local encontrado"
            subtitle="Desculpe! Infelizmente, não econtramos nenhum local referente a sua pesquisa."
          />
        }
      />
    </SafeAreaView>
  );
};

const LoadingSkeleton: FC = memo(() => {
  const styles = usePlaceStyles();

  return (
    <ScrollView>
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} style={styles.container}>
          <View>
            <SkeletonText width="100%" height={200} />
            <View style={styles.logo}>
              <SkeletonCircle size={70} />
            </View>
          </View>
          <Card.Content style={styles.content}>
            <View style={{ gap: 10 }}>
              <SkeletonText width="60%" height={24} />
              <SkeletonText width="40%" height={16} />
            </View>
            <View>
              <Text variant="bodySmall" style={{ marginBottom: 10 }}>
                Promoções
              </Text>
              <View style={{ gap: 10 }}>
                <SkeletonText width="95%" height={14} />
                <SkeletonText width="70%" height={14} />
              </View>
              <Divider style={{ marginVertical: 8 }} />
              <SkeletonText width="90%" height={14} />
              <Divider style={{ marginVertical: 8 }} />
              <View style={{ gap: 10 }}>
                <SkeletonText width="95%" height={14} />
                <SkeletonText width="20%" height={14} />
              </View>
            </View>
            <Button disabled>Ver mais</Button>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default PlaceList;
