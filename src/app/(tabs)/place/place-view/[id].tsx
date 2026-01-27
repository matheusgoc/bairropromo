import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Icon, List, Switch, Text } from 'react-native-paper';

import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import PlaceModel from '@/models/place.model';
import PlaceService from '@/services/place.service';

const PlaceView: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [place, setPlace] = useState<PlaceModel>();
  const [signedPromos, setSignedPromos] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await PlaceService.get(id);
      setPlace(data);
      setLoading(false);
    } catch (error) {
      console.error(`Failed to load place #${id}`, error);
      setLoading(false);
    }
  }, [id]);

  const apply = useCallback(
    (id: string) => {
      const index = signedPromos.findIndex((vid) => vid === id);
      if (index >= 0) {
        setSignedPromos((prev) => prev.toSpliced(index, 1));
      } else {
        setSignedPromos((prev) => [...prev, id]);
      }
    },
    [signedPromos],
  );

  useEffect(() => {
    load();
  }, [load]);

  const styles = useStyles();

  return !place ? (
    <LoadingSkeleton />
  ) : (
    <ScrollView
      refreshControl={<RefreshControl onRefresh={load} refreshing={loading} />}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={styles.header}>
        {place.logo && (
          <Image
            source={place.logo}
            contentFit="cover"
            transition={1000}
            alt={`Logo de ${place.name}.`}
            style={styles.logo}
          />
        )}
        <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
          {place.name}
        </Text>
        <Text variant="labelSmall" style={styles.headerTitle}>
          {place.city.toUpperCase()} - {place.state}
        </Text>
      </View>
      <Image
        source={place.photo}
        contentFit="cover"
        transition={1000}
        alt={`Foto de ${place.name}.`}
        style={{ height: 200 }}
      />
      <List.Section>
        <List.Subheader>Promoções</List.Subheader>
        {place.offers?.length === 0 ? (
          <>
            <List.Item title="Nenhuma promoção no momento!" />
            <Divider />
          </>
        ) : (
          place.offers?.map((p, i) => (
            <View key={p.id} style={styles.promoItemContainer}>
              <List.Item
                title={p.title}
                titleNumberOfLines={3}
                left={() => (
                  <Switch
                    value={!!signedPromos.find((sp) => sp === p.id)}
                    onValueChange={() => apply(p.id)}
                  />
                )}
              />
              {i < place.offers.length - 1 && <Divider />}
            </View>
          ))
        )}
      </List.Section>
      <Card style={{ margin: 10 }} mode="contained">
        <Card.Title title="Localização" />
        <Card.Content>
          <Text variant="bodyLarge">{place.address}</Text>
          <Text variant="bodyLarge">
            {place.city} - {place.state}
          </Text>
          <Text variant="bodyMedium">CEP: {place.postalCode}</Text>
        </Card.Content>
      </Card>
      {(place.phone || place.website || place.email) && (
        <Card style={{ margin: 10 }}>
          <Card.Title title="Contato" />
          <Card.Content>
            {place.phone && (
              <List.Item
                title={place.phone}
                left={() => (
                  <Icon
                    source={
                      place.isWhatsapp ? 'whatsapp' : 'phone-dial-outline'
                    }
                    size={20}
                  />
                )}
              />
            )}
            {place.website && (
              <List.Item
                title={place.website}
                left={() => <Icon source="link" size={20} />}
              />
            )}
            {place.email && (
              <List.Item
                title={place.email}
                left={() => <Icon source="at" size={20} />}
              />
            )}
          </Card.Content>
        </Card>
      )}
      {place.description && (
        <Text variant="bodyMedium" style={{ marginHorizontal: 20 }}>
          {place.description}
        </Text>
      )}
    </ScrollView>
  );
};

const useStyles = () =>
  StyleSheet.create({
    header: { alignItems: 'center', margin: 20 },
    headerTitle: { fontWeight: 'bold', textTransform: 'uppercase' },
    logo: { width: 70, height: 70, borderRadius: 50 },
    promoItemContainer: {
      marginLeft: 20,
      marginRight: 5,
    },
    promoItem: {},
  });

const LoadingSkeleton: FC = memo(() => {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={{ marginBottom: 100 }}>
      <View style={{ ...styles.header, gap: 20 }}>
        <SkeletonCircle size={70} />
        <SkeletonText width="80%" height={40} />
        <SkeletonText width="50%" height={20} />
      </View>
      <SkeletonText width="100%" height={200} />
      <View style={{ margin: 20 }}>
        <Text variant="bodyMedium">Promoções:</Text>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}
            >
              <Switch disabled />
              <View style={{ gap: 10, marginLeft: 10 }}>
                <SkeletonText width="90%" height={10} />
                <SkeletonText width="60%" height={10} />
              </View>
            </View>
            {i < 2 && <Divider />}
          </View>
        ))}
      </View>
      <Card style={{ margin: 10 }} mode="contained">
        <Card.Title title="Localização:" />
        <Card.Content style={{ gap: 10 }}>
          <SkeletonText width="90%" height={15} />
          <SkeletonText width="60%" height={15} />
          <SkeletonText width="30%" height={10} />
        </Card.Content>
      </Card>
      <Card style={{ margin: 10 }}>
        <Card.Title title="Contato:" />
        <Card.Content style={{ gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon source="phone-dial-outline" size={20} />
            <SkeletonText width="70%" height={15} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon source="link" size={20} />
            <SkeletonText width="90%" height={15} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon source="at" size={20} />
            <SkeletonText width="95%" height={15} />
          </View>
        </Card.Content>
      </Card>
      <View style={{ gap: 10, margin: 10 }}>
        <SkeletonText width="95%" height={15} />
        <SkeletonText width="80%" height={15} />
        <SkeletonText width="50%" height={15} />
      </View>
    </ScrollView>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default PlaceView;
