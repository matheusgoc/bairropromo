import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import {
  Button,
  Dialog,
  Icon,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSubscription } from '@/hooks/use-subscription';
import ProfileService, { ApplyPayload } from '@/services/profile.service';
import ToastService from '@/services/toast.service';

interface PriceOptionCardProps {
  prefix?: string;
  price: string;
  suffix: string;
  selected: boolean;
  onPress: () => void;
}

const PriceOptionCard: FC<PriceOptionCardProps> = ({
  prefix,
  price,
  suffix,
  selected,
  onPress,
}) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: selected ? theme.colors.primary : theme.colors.outline,
        backgroundColor: selected
          ? theme.colors.primaryContainer
          : theme.colors.surface,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon
        source={selected ? 'radiobox-marked' : 'radiobox-blank'}
        size={24}
        color={selected ? theme.colors.primary : theme.colors.outline}
      />
      <View>
        {prefix && (
          <Text
            variant="bodyMedium"
            style={{
              color: selected
                ? theme.colors.onPrimaryContainer
                : theme.colors.onSurfaceVariant,
            }}
          >
            {prefix}
          </Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text
            variant="headlineSmall"
            style={{
              padding: 5,
              color: selected
                ? theme.colors.onPrimaryContainer
                : theme.colors.onSurfaceVariant,
            }}
          >
            R$
          </Text>
          <Text
            variant="displayLarge"
            style={{
              color: selected
                ? theme.colors.onPrimaryContainer
                : theme.colors.onSurfaceVariant,
            }}
          >
            {price}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: selected
                ? theme.colors.onPrimaryContainer
                : theme.colors.onSurfaceVariant,
            }}
          >
            {suffix}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const OnboardApply: FC = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const { setStatus } = useSubscription();

  const { control, handleSubmit, watch } = useForm<ApplyPayload>();
  const plan = watch('plan');

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ApplyPayload) => ProfileService.apply(data),
    onSuccess: () => {
      setStatus('success');
      router.push('/onboard/onboard-success');
    },
    onError: () =>
      ToastService.error(
        'Não foi possível processar sua assinatura. Tente novamente.',
      ),
  });

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
      <View style={{ flex: 1, paddingTop: 32, gap: 24 }}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
          Escolha seu plano:
        </Text>
        <Controller
          name="plan"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={{ gap: 12 }}>
              <PriceOptionCard
                prefix="Apenas"
                price="9,90"
                suffix="por mês"
                selected={value === 'monthly'}
                onPress={() => onChange('monthly')}
              />
              <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
                Ou
              </Text>
              <PriceOptionCard
                prefix="Apenas"
                price="99,90"
                suffix="por ano"
                selected={value === 'yearly'}
                onPress={() => onChange('yearly')}
              />
            </View>
          )}
        />
      </View>
      <View style={{ gap: 12, paddingBottom: 16 }}>
        <Button
          mode="contained"
          disabled={!plan || isPending}
          loading={isPending}
          onPress={handleSubmit((data) => mutate(data))}
          labelStyle={{ fontSize: 16 }}
        >
          Assinar
        </Button>
        <Button
          onPress={() => setDialogVisible(true)}
          labelStyle={{ fontSize: 16 }}
        >
          Agora Não
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Tudo bem! 😊</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Você poderá contribuir futuramente quando quiser se beneficiar com
              as ofertas exclusivas do seu bairro.
            </Text>
            <Text variant="bodyMedium" style={{ marginTop: 12 }}>
              Por enquanto, você ainda pode explorar os locais e ofertas
              disponíveis. Assim que quiser aproveitar todos os benefícios, é só
              assinar um plano!
            </Text>
            <Text variant="bodyMedium" style={{ marginTop: 12 }}>
              E se você possui algum comércio, serviço ou qualquer outra
              empresa, também pode contribuir cadastrando suas próprias ofertas
              para a comunidade. 🏪
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={() => router.replace('/(tabs)/place/place-list')}
            >
              Entendi
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default OnboardApply;
