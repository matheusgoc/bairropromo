import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { FC, Fragment, memo, useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Icon, List, Switch, Text } from 'react-native-paper';

import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import SubscriptionDialog from '@/components/ui/subscription-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import OfferModel from '@/models/offer.model';
import PlaceLocationModel from '@/models/place-location.model';
import PlaceModel from '@/models/place.model';
import { HttpError } from '@/services/http.service';
import OfferService from '@/services/offer.service';
import PlaceService from '@/services/place.service';

const PlaceView: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [signedPromos, setSignedPromos] = useState<string[]>([]);
  const [authDialog, setAuthDialog] = useState(false);
  const [subscriptionDialog, setSubscriptionDialog] = useState(false);

  const { isSignedIn } = useAuth();
  const { isSubscribed, setStatus } = useSubscription();

  const {
    data: place,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['place', id],
    queryFn: () => PlaceService.get(id),
  });

  const apply = useCallback(
    async (offerId: string) => {
      if (!isSignedIn) {
        setAuthDialog(true);
        return;
      }
      if (!isSubscribed) {
        setSubscriptionDialog(true);
        return;
      }
      const index = signedPromos.findIndex((v) => v === offerId);
      try {
        if (index >= 0) {
          await OfferService.unassign(offerId);
          setSignedPromos((prev) => prev.toSpliced(index, 1));
        } else {
          await OfferService.assign(offerId);
          setSignedPromos((prev) => [...prev, offerId]);
        }
      } catch (err) {
        if (err instanceof HttpError && err.status === 402) {
          setStatus('pending');
          setSubscriptionDialog(true);
        }
      }
    },
    [isSignedIn, isSubscribed, signedPromos, setStatus],
  );

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const styles = useStyles();

  return isPending || !place ? (
    <LoadingSkeleton />
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={handleRefresh} refreshing={isRefetching} />
      }
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
        {place.offers?.map((offer, i) => (
          <View key={offer.id} style={{ marginLeft: 20, marginRight: 5 }}>
            <Offer
              offer={offer}
              isSigned={!!signedPromos.find((sp) => sp === offer.id)}
              onApply={() => apply(offer.id)}
            />
            {i < place.offers.length - 1 && <Divider />}
          </View>
        ))}
      </List.Section>
      <List.Section>
        {place.locations.map((location) => (
          <Location
            key={location.id}
            location={location}
            place={place}
            signedPromos={signedPromos}
            onApply={apply}
          />
        ))}
      </List.Section>
      {place.description && (
        <Text variant="bodyMedium" style={{ marginHorizontal: 20 }}>
          {place.description}
        </Text>
      )}

      <SubscriptionDialog
        visible={authDialog}
        onDismiss={() => setAuthDialog(false)}
        onSubscribe={() => router.push('/onboard/onboard-call')}
      />
      <SubscriptionDialog
        visible={subscriptionDialog}
        onDismiss={() => setSubscriptionDialog(false)}
        onSubscribe={() => router.push('/onboard/onboard-apply')}
      />
    </ScrollView>
  );
};

const useStyles = () =>
  StyleSheet.create({
    header: { alignItems: 'center', margin: 20 },
    logo: { width: 100, height: 100, borderRadius: 50 },
    promoItemContainer: {
      marginLeft: 20,
      marginRight: 5,
    },
    promoItem: {},
  });

const Offer: FC<{
  offer: OfferModel;
  isSigned: boolean;
  onApply: (id: string) => void;
}> = memo(({ offer, isSigned, onApply }) => (
  <List.Item
    title={offer.title}
    titleNumberOfLines={3}
    left={() => (
      <Switch value={isSigned} onValueChange={() => onApply(offer.id)} />
    )}
  />
));

Offer.displayName = 'Offer';

const Location: FC<{
  location: PlaceLocationModel;
  place: PlaceModel;
  signedPromos: string[];
  onApply: (id: string) => Promise<void>;
}> = memo(({ location, place, signedPromos, onApply }) => (
  <Card style={{ margin: 10 }} mode="contained">
    <Card.Title
      title={location.name}
      subtitle={`${location.city} - ${location.state}`}
      titleStyle={{ fontWeight: 'bold' }}
    />
    <Card.Content>
      {location.offers?.map((offer, i) => (
        <Fragment key={offer.id}>
          <Offer
            offer={offer}
            isSigned={!!signedPromos.find((sp) => sp === offer.id)}
            onApply={() => onApply(offer.id)}
          />
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
));

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
        <View style={{ margin: 20 }}>
          <View style={{ gap: 10 }}>
            <SkeletonText width="40%" height={20} />
            <SkeletonText width="60%" height={10} />
          </View>
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
