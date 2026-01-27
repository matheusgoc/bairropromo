import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Avatar, Button, Text, useTheme } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import { extractInitials } from '@/helpers';
import OfferModel from '@/models/offer.model';
import OfferService from '@/services/offer.service';

const OfferCode: FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>();
  const [code, setCode] = useState<string>();
  const [offer, setOffer] = useState<OfferModel>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { code, offer } = await OfferService.getCode(id);
      setCode(code);
      setOffer(offer);
      setLoading(false);
    } catch (error) {
      console.error(`Failed to load offer #${id}`, error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !offer) {
    return <LoadingSkeleton />;
  }

  return (
    <SafeAreaView
      style={{
        gap: 20,
        margin: 20,
        alignItems: 'center',
      }}
    >
      {offer.place?.logo ? (
        <Image
          source={offer.place?.logo}
          contentFit="cover"
          transition={1000}
          alt={`Logo de ${offer.place?.name}`}
          style={{
            width: 80,
            height: 80,
            borderRadius: 50,
            alignSelf: 'center',
          }}
        />
      ) : (
        <Avatar.Text size={80} label={extractInitials(offer.place?.name)} />
      )}
      <Text variant="headlineLarge">{offer.place?.name}</Text>
      <Text variant="labelLarge" style={{ marginVertical: 30 }}>
        {offer.title}
      </Text>
      <Text variant="labelMedium">
        Mostre esse código para validar a promoção:
      </Text>
      <QRCode value={code} />
      <Text variant="headlineLarge">{code}</Text>
      <Button
        mode="contained"
        style={{ marginTop: 50 }}
        onPress={() => router.back()}
        icon="check-bold"
      >
        Pronto!
      </Button>
    </SafeAreaView>
  );
};

const LoadingSkeleton: FC = memo(() => {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={{
        gap: 20,
        margin: 20,
        alignItems: 'center',
      }}
    >
      <SkeletonCircle size={80} />
      <SkeletonText width={200} height={40} />
      <View style={{ marginVertical: 30, gap: 10 }}>
        <SkeletonText width="100%" height={10} />
        <SkeletonText width="80%" height={10} />
        <SkeletonText width="60%" height={10} />
      </View>
      <Text
        variant="labelMedium"
        selectionColor="red"
        style={{ color: theme.colors.outline }}
      >
        Mostre esse código para validar a promoção:
      </Text>
      <SkeletonText width={100} height={100} />
      <SkeletonText width={120} height={30} />
      <Button
        mode="contained"
        style={{ marginTop: 50 }}
        icon="check-bold"
        disabled
      >
        Pronto!
      </Button>
    </SafeAreaView>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default OfferCode;
