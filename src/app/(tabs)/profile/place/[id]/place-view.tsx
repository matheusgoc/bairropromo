import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { FC, Fragment, memo, useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Divider,
  FAB,
  Icon,
  IconButton,
  List,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import OfferModel from '@/models/offer.model';
import PlaceLocationModel from '@/models/place-location.model';
import PlaceModel from '@/models/place.model';
import PlaceService from '@/services/place.service';

const PlaceView: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [fabOpen, setFabOpen] = useState(false);

  const {
    data: place,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['place', id],
    queryFn: () => PlaceService.get(id),
  });

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const styles = useStyles();
  const { colors } = useTheme();

  const editPlace = () => {
    router.navigate({
      pathname: '../[id]/place-form',
      params: { id },
    });
  };

  const editOwners = () => {
    router.navigate({
      pathname: '../[id]/place-owner',
      params: { id },
    });
  };

  const editLocations = () => {
    router.navigate({
      pathname: '../[id]/location/location-list',
      params: { id },
    });
  };

  const editOffers = () => {
    router.navigate({
      pathname: '../[id]/offer/offer-list',
      params: { id },
    });
  };

  const editLogo = () => {};

  const editPhoto = () => {};

  return isPending || !place ? (
    <LoadingSkeleton />
  ) : (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={isRefetching} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          {place.logo ? (
            <View style={styles.logoContainer}>
              <Image
                source={place.logo}
                contentFit="cover"
                transition={1000}
                alt={`Logo de ${place.name}.`}
                style={styles.logo}
              />
              <IconButton
                icon="image-edit"
                size={20}
                mode="contained"
                onPress={editLogo}
                style={styles.logoBadge}
              />
            </View>
          ) : (
            <IconButton
              icon="image-plus-outline"
              size={36}
              mode="contained"
              onPress={editLogo}
              style={styles.logo}
            />
          )}
          <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
            {place.name}
          </Text>
        </View>
        {place.photo ? (
          <View>
            <Image
              source={place.photo}
              contentFit="cover"
              transition={1000}
              alt={`Foto de ${place.name}.`}
              style={{ height: 200 }}
            />
            <IconButton
              icon="image-edit"
              size={30}
              mode="contained"
              onPress={editPhoto}
              style={styles.photoBadge}
            />
          </View>
        ) : (
          <TouchableRipple
            onPress={editPhoto}
            style={[
              styles.photoPlaceholder,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <IconButton icon="image-plus-outline" size={48} mode="contained" />
          </TouchableRipple>
        )}
        <List.Section>
          <List.Subheader>Promoções</List.Subheader>
          {place.offers?.length ? (
            place.offers.map((offer, i) => (
              <View key={offer.id} style={{ marginLeft: 20, marginRight: 5 }}>
                <Offer offer={offer} />
                {i < place.offers.length - 1 && <Divider />}
              </View>
            ))
          ) : (
            <OfferListEmptyState id={id} />
          )}
        </List.Section>
        <List.Section>
          <List.Subheader>Unidades</List.Subheader>
          {place.locations.map((location) => (
            <Location key={location.id} location={location} place={place} />
          ))}
        </List.Section>
        {place.description && (
          <Text variant="bodyMedium" style={{ marginHorizontal: 20 }}>
            {place.description}
          </Text>
        )}
      </ScrollView>
      <FAB.Group
        open={fabOpen}
        visible
        icon={fabOpen ? 'close' : 'pencil'}
        onStateChange={({ open }) => setFabOpen(open)}
        actions={[
          {
            icon: 'store-edit-outline',
            label: 'Editar Local',
            onPress: editPlace,
          },
          {
            icon: 'map-marker-multiple-outline',
            label: 'Editar Unidades',
            onPress: editLocations,
          },
          {
            icon: 'tag-edit-outline',
            label: 'Editar Ofertas',
            onPress: editOffers,
          },
          {
            icon: 'account-group',
            label: 'Definir Dono',
            onPress: editOwners,
          },
        ]}
      />
    </View>
  );
};

const useStyles = () =>
  StyleSheet.create({
    header: { alignItems: 'center', margin: 20 },
    logo: { width: 100, height: 100, borderRadius: 50 },
    logoContainer: { width: 100, height: 100 },
    logoBadge: { position: 'absolute', bottom: -4, right: -4, margin: 0 },
    photoBadge: { position: 'absolute', bottom: 8, right: 8, margin: 0 },
    photoPlaceholder: {
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    promoItemContainer: {
      marginLeft: 20,
      marginRight: 5,
    },
    promoItem: {},
  });

const OfferListEmptyState: FC<{ id: string; isLocation?: boolean }> = memo(
  ({ id, isLocation }) => {
    const addOffer = () => {
      router.navigate({
        pathname: '../[id]/offer/[offerId]/offer-form',
        params: { id, offerId: 'new' },
      });
    };
    return (
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 20 }}>
        <Text variant="bodyMedium">
          Nenhuma oferta cadastrada{isLocation ? ' neste local' : ''}!
        </Text>
        <Button mode="contained" icon="tag-edit-outline" onPress={addOffer}>
          Adicionar Oferta
        </Button>
      </View>
    );
  },
);

OfferListEmptyState.displayName = 'OfferListEmptyState';

const Offer: FC<{ offer: OfferModel }> = memo(({ offer }) => (
  <List.Item
    title={offer.title}
    titleNumberOfLines={3}
    left={() => <List.Icon icon="circle-medium" />}
  />
));

Offer.displayName = 'Offer';

const Location: FC<{ location: PlaceLocationModel; place: PlaceModel }> = memo(
  ({ location, place }) => (
    <Card style={{ margin: 10 }} mode="contained">
      <Card.Title
        title={location.name}
        subtitle={`${location.city} - ${location.state}`}
        titleStyle={{ fontWeight: 'bold' }}
      />
      <Card.Content>
        {location.offers?.map((offer, i) => (
          <Fragment key={offer.id}>
            <Offer offer={offer} />
            {i < place.offers.length - 1 && <Divider />}
          </Fragment>
        ))}
        <Card style={{ marginBottom: 10 }}>
          <Card.Title title="Endereço:" />
          <Card.Content>
            <Text variant="bodyLarge">{location.address}</Text>
            <Text variant="bodyLarge">
              {location.city} - {location.state}
            </Text>
            <Text variant="bodyLarge">CEP: {location.postalCode}</Text>
          </Card.Content>
        </Card>
        {(location.phone || place.website || location.email) && (
          <Card>
            <Card.Title title="Contato:" />
            <Card.Content>
              {location.phone && (
                <LocationContatctItem
                  label={location.phone}
                  icon={location.isWhatsapp ? 'whatsapp' : 'phone-dial-outline'}
                />
              )}
              {location.email && (
                <LocationContatctItem label={location.email} icon="at" />
              )}
              {place.website && (
                <LocationContatctItem label={place.website} icon="link" />
              )}
            </Card.Content>
          </Card>
        )}
      </Card.Content>
    </Card>
  ),
);

Location.displayName = 'Location';

const LocationContatctItem: FC<{ label: string; icon?: string }> = memo(
  ({ label, icon }) => (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical: 10,
      }}
    >
      {icon && <Icon source={icon} size={20} />}
      <Text variant="bodyLarge">{label}</Text>
    </View>
  ),
);

LocationContatctItem.displayName = 'LocationContatctItem';

const LoadingSkeleton: FC = memo(() => {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={{ marginBottom: 100 }}>
      <View style={{ ...styles.header, gap: 20 }}>
        <SkeletonCircle size={100} />
        <SkeletonText width="80%" height={40} />
      </View>
      <SkeletonText width="100%" height={200} />
      <View style={{ margin: 20 }}>
        <Text variant="bodyMedium">Promoções</Text>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i}>
            <View style={{ gap: 10, marginVertical: 20 }}>
              <SkeletonText width="90%" height={10} />
              <SkeletonText width="60%" height={10} />
            </View>
            {i < 2 && <Divider />}
          </View>
        ))}
      </View>
      <Text variant="bodyMedium" style={{ marginLeft: 20 }}>
        Unidades
      </Text>
      <Card style={{ margin: 10 }} mode="contained">
        <View style={{ margin: 20 }}>
          <View style={{ gap: 10 }}>
            <SkeletonText width="40%" height={20} />
            <SkeletonText width="60%" height={10} />
          </View>
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={i}>
              <View style={{ gap: 10, marginVertical: 20 }}>
                <SkeletonText width="90%" height={10} />
                <SkeletonText width="60%" height={10} />
              </View>
              {i < 2 && <Divider />}
            </View>
          ))}
        </View>
        <Card style={{ margin: 10 }}>
          <Card.Title title="Endereço:" />
          <Card.Content style={{ gap: 10 }}>
            <SkeletonText width="90%" height={15} />
            <SkeletonText width="60%" height={15} />
            <SkeletonText width="30%" height={10} />
          </Card.Content>
        </Card>
        <Card style={{ margin: 10 }}>
          <Card.Title title="Contato:" />
          <Card.Content style={{ gap: 20 }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <Icon source="phone-dial-outline" size={20} />
              <SkeletonText width="70%" height={15} />
            </View>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <Icon source="link" size={20} />
              <SkeletonText width="90%" height={15} />
            </View>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <Icon source="at" size={20} />
              <SkeletonText width="95%" height={15} />
            </View>
          </Card.Content>
        </Card>
      </Card>
    </ScrollView>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default PlaceView;
