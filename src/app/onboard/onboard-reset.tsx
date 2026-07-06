import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import TextInput from '@/components/form/text-input';
import ProfileService, { ResetPayload } from '@/services/profile.service';
import ToastService from '@/services/toast.service';

const OnboardReset: FC = () => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const { control, handleSubmit, watch } = useForm<ResetPayload>({
    defaultValues: { email: '' },
  });

  const email = watch('email', '');

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ResetPayload) => ProfileService.resetPassword(data),
    onSuccess: () => setDialogVisible(true),
    onError: () =>
      ToastService.error('Não foi possível enviar o e-mail. Tente novamente.'),
  });

  const handleDone = () => router.replace('/(tabs)/place/place-list');

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
        <Text variant="headlineSmall">Informe o seu e-mail</Text>
        <TextInput
          control={control}
          name="email"
          label="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          rules={{
            required: 'E-mail é obrigatório',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'E-mail inválido',
            },
          }}
        />
      </View>
      <View style={{ paddingBottom: 16 }}>
        <Button
          mode="contained"
          onPress={handleSubmit((data) => mutate(data))}
          loading={isPending}
          disabled={isPending}
          labelStyle={{ fontSize: 16 }}
        >
          Alterar Senha
        </Button>
      </View>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={handleDone}>
          <Dialog.Icon icon="email-check-outline" />
          <Dialog.Title style={{ textAlign: 'center' }}>
            E-mail enviado!
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Enviamos as instruções para redefinição da sua senha para{' '}
              <Text style={{ fontWeight: 'bold' }}>{email}</Text>.
            </Text>
            <Text variant="bodyMedium" style={{ marginTop: 12 }}>
              Acesse sua caixa de entrada e siga o link que enviamos. Caso não
              encontre, verifique também a pasta de spam ou lixo eletrônico.
            </Text>
            <Text variant="bodyMedium" style={{ marginTop: 12 }}>
              O link de redefinição é válido por 24 horas.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" onPress={handleDone}>
              Entendi
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default OnboardReset;
