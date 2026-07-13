import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FC, memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Avatar, Button, Text, useTheme } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import Dialog from '@/components/ui/dialog';
import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import { extractInitials } from '@/helpers';
import { useSubscription } from '@/hooks/use-subscription';
import { HttpError } from '@/services/http.service';
import OfferService from '@/services/offer.service';

const OfferCode: FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { setStatus } = useSubscription();
  const [paymentDialog, setPaymentDialog] = useState(false);

  const { data, isPending, error } = useQuery({
    queryKey: ['offer-code', id],
    queryFn: () => OfferService.getCode(id),
    retry: false,
  });

  useEffect(() => {
    if (error instanceof HttpError && error.status === 402) {
      setStatus('pending');
      setPaymentDialog(true);
    }
  }, [error, setStatus]);

  const offer = data?.offer;

  if (isPending || !offer) {
    return (
      <>
        <LoadingSkeleton />
        <Dialog
          visible={paymentDialog}
          onDismiss={() => {
            setPaymentDialog(false);
            router.back();
          }}
          title="Ops! Tem algum problema com a sua assinatura!"
          message="Não foi possível carregar o código. Sua assinatura pode estar com pagamento pendente."
          mode="warning"
          actions={[
            {
              label: 'Cancelar',
              callback: () => {
                setPaymentDialog(false);
                router.back();
              },
            },
            {
              label: 'Regularizar',
              isPrimary: true,
              callback: () => {
                setPaymentDialog(false);
                router.replace('/onboard/onboard-apply');
              },
            },
          ]}
        />
      </>
    );
  }

  return (
    <SafeAreaView
      style={{
        gap: 10,
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
      <View>
        <Text variant="headlineMedium" style={{ textAlign: 'center' }}>
          {offer.place?.name}
        </Text>
        {offer.location && (
          <>
            <Text variant="titleMedium" style={{ textAlign: 'center' }}>
              {offer.location.name}
            </Text>
            <Text variant="titleMedium" style={{ textAlign: 'center' }}>
              {`${offer.location.city} - ${offer.location.state}`}
            </Text>
          </>
        )}
      </View>
      <Text
        variant="titleMedium"
        style={{ marginVertical: 30, fontWeight: 'bold', textAlign: 'center' }}
      >
        {offer.title}
      </Text>
      <Text variant="labelMedium">
        Mostre esse código para validar a promoção:
      </Text>
      <QRCode value={data?.code} />
      <Text variant="headlineLarge">{data?.code}</Text>
      {offer.location && (
        <Text
          variant="labelMedium"
          style={{
            fontStyle: 'italic',
            textAlign: 'center',
            width: '100%',
            backgroundColor: theme.colors.surfaceVariant,
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>Atenção: </Text>
          <Text>promoção valida apenas em </Text>
          <Text style={{ fontWeight: 'bold', color: theme.colors.tertiary }}>
            {`${offer.location.name} (${offer.location.city} - ${offer.location.state})`}
          </Text>
        </Text>
      )}
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
