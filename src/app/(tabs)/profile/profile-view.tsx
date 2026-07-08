import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FC, memo, useCallback, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import { extractInitials } from '@/helpers';
import { useAuth } from '@/hooks/use-auth';
import ProfileService from '@/services/profile.service';

const SubscriptionSuccessCard: FC = () => (
  <Card mode="contained" style={{ marginTop: 20 }}>
    <Card.Title title="Minha Assinatura" titleStyle={{ fontWeight: 'bold' }} />
    <Card.Content>
      <Text variant="bodyMedium">
        Parabéns! A sua inscrição já está completa.
      </Text>
      <Text variant="bodyMedium" style={{ marginVertical: 10 }}>
        Aproveite as promoções exclusivas do seu bairro.
      </Text>
    </Card.Content>
    <Card.Actions style={{ justifyContent: 'center', marginBottom: 10 }}>
      <Button mode="contained">Quero modificar minha assinatura!</Button>
    </Card.Actions>
  </Card>
);

const SubscriptionPendingCard: FC = () => (
  <Card mode="contained" style={{ marginTop: 20 }}>
    <Card.Title title="Minha Assinatura" titleStyle={{ fontWeight: 'bold' }} />
    <Card.Content>
      <Text variant="bodyMedium">
        Opa! Estamos passando por dificuldades para realizar o pagamento da sua
        assinatura.
      </Text>
    </Card.Content>
    <Card.Actions style={{ justifyContent: 'center', marginVertical: 10 }}>
      <Button mode="contained">Regularizar minha assinatura</Button>
    </Card.Actions>
  </Card>
);

const SubscriptionNotAppliedCard: FC = () => (
  <Card mode="contained" style={{ marginTop: 20 }}>
    <Card.Title title="Minha Assinatura" titleStyle={{ fontWeight: 'bold' }} />
    <Card.Content>
      <Text variant="bodyMedium">
        Seja membro e aproveite as ofertas exclusivas do seu bairro.
      </Text>
      <Divider style={{ marginVertical: 10 }} />
      <View style={{ alignItems: 'center' }}>
        <Text
          variant="titleMedium"
          style={{ alignSelf: 'flex-start', marginBottom: 10 }}
        >
          Por apenas:
        </Text>
        <Text
          variant="headlineLarge"
          style={{ fontWeight: 'bold', fontSize: 38 }}
        >
          R$ 9,90 <Text variant="bodyMedium">por mês</Text>
        </Text>
      </View>
    </Card.Content>
    <Card.Actions style={{ justifyContent: 'center', marginVertical: 10 }}>
      <Button
        mode="contained"
        onPress={() => router.push('/onboard/onboard-apply')}
      >
        Quero ser membro do bairro!
      </Button>
    </Card.Actions>
  </Card>
);

interface PlaceCardProps {
  onPress: () => void;
}

const MyPlacesCard: FC<PlaceCardProps> = ({ onPress }) => (
  <Card mode="contained" style={{ marginTop: 20 }}>
    <Card.Title title="Meus Locais" titleStyle={{ fontWeight: 'bold' }} />
    <Card.Content>
      <Text variant="bodyMedium">Você possui um perfil empreendedor.</Text>
      <Divider style={{ marginVertical: 10 }} />
      <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
        Locais: 2 ativos de 3.
      </Text>
      <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
        Promoções: 10 ativas de 100.
      </Text>
      <Divider style={{ marginVertical: 10 }} />
    </Card.Content>
    <Card.Actions style={{ justifyContent: 'center', marginVertical: 10 }}>
      <Button mode="contained" onPress={onPress}>
        Gerenciar Locais
      </Button>
    </Card.Actions>
  </Card>
);

const MyPlacesNotAppliedCard: FC<PlaceCardProps> = ({ onPress }) => (
  <Card mode="contained" style={{ marginTop: 20 }}>
    <Card.Title title="Meus Locais" titleStyle={{ fontWeight: 'bold' }} />
    <Card.Content>
      <Text variant="bodyMedium">
        Você administra algum negócio local e gostaria de compartilhar
        promoções, descontos e ofertas no bairro?
      </Text>
      <Text variant="bodyMedium">Faça parte da nossa comunidade!</Text>
    </Card.Content>
    <Card.Actions style={{ justifyContent: 'center', marginVertical: 10 }}>
      <Button mode="contained" onPress={onPress}>
        Cadastrar Locais
      </Button>
    </Card.Actions>
  </Card>
);

const ProfileView: FC = () => {
  const { isSignedIn, signOut } = useAuth();
  const theme = useTheme();

  const { mutate: mutateSignout, isPending: isSigningOut } = useMutation({
    mutationFn: ProfileService.signout,
    onSuccess: () => {
      signOut();
      router.replace('/onboard/onboard-call');
    },
  });

  const handleSignOut = useCallback(() => {
    Alert.alert('Sair da conta', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => mutateSignout() },
    ]);
  }, [mutateSignout]);

  const {
    data: profile,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: ProfileService.get,
    enabled: isSignedIn,
  });

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const goToPlacePage = useCallback(() => {
    if (!profile?.id) return;

    router.navigate({
      pathname: '/profile/place/place-list',
      params: { profile: profile.id },
    });
  }, [profile?.id]);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/onboard/onboard-call');
    }
  }, [isSignedIn]);

  if (isPending || !profile) return <LoadingSkeleton />;

  const isOwner = ['owner', 'admin', 'master'].includes(profile.role ?? '');
  const greeting =
    profile.gender === 'F' ? 'Seja bem-vinda,' : 'Seja bem-vindo,';

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, paddingHorizontal: 15 }}>
      <Text variant="titleMedium" style={{ margin: 20 }}>
        {greeting}
      </Text>
      <View style={{ alignItems: 'center' }}>
        <Avatar.Text size={80} label={extractInitials(profile.name)} />
        <Text variant="headlineMedium">{profile.name}</Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
      >
        {profile.subscriptionStatus === 'success' && (
          <SubscriptionSuccessCard />
        )}
        {profile.subscriptionStatus === 'pending' && (
          <SubscriptionPendingCard />
        )}
        {profile.subscriptionStatus === 'not_applied' && (
          <SubscriptionNotAppliedCard />
        )}
        {isOwner ? (
          <MyPlacesCard onPress={goToPlacePage} />
        ) : (
          <MyPlacesNotAppliedCard onPress={goToPlacePage} />
        )}
        <Button
          icon="logout"
          onPress={handleSignOut}
          loading={isSigningOut}
          disabled={isSigningOut}
          textColor={theme.colors.error}
          style={{ marginTop: 24, marginBottom: 16 }}
        >
          Sair da conta
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const LoadingSkeleton: FC = memo(() => (
  <SafeAreaView edges={['top']} style={{ flex: 1, paddingHorizontal: 15 }}>
    <Text variant="titleMedium" style={{ margin: 20 }}>
      Seja bem-vindo(a),
    </Text>
    <View style={{ alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <SkeletonCircle size={80} />
      <SkeletonText width="70%" height={28} />
    </View>
    <ScrollView>
      <Card mode="contained" style={{ marginTop: 20 }}>
        <Card.Title
          title="Minha Assinatura"
          titleStyle={{ fontWeight: 'bold' }}
        />
        <Card.Content style={{ gap: 10 }}>
          <SkeletonText width="90%" height={14} />
          <SkeletonText width="70%" height={14} />
        </Card.Content>
        <View style={{ alignItems: 'center', marginTop: 25, marginBottom: 15 }}>
          <SkeletonText width="45%" height={36} />
        </View>
      </Card>
      <Card mode="contained" style={{ marginTop: 20 }}>
        <Card.Title title="Meus Locais" titleStyle={{ fontWeight: 'bold' }} />
        <Card.Content style={{ gap: 10 }}>
          <SkeletonText width="70%" height={14} />
          <Divider style={{ marginVertical: 10 }} />
          <SkeletonText width="50%" height={14} />
          <SkeletonText width="55%" height={14} />
        </Card.Content>
        <View style={{ alignItems: 'center', marginTop: 25, marginBottom: 15 }}>
          <SkeletonText width="45%" height={36} />
        </View>
      </Card>
    </ScrollView>
  </SafeAreaView>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default ProfileView;
