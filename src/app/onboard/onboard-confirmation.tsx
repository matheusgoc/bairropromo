import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FC } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import CodeInput from '@/components/form/code-input';
import { formatCountdown } from '@/helpers';
import useAppTheme from '@/hooks/use-app-theme';
import { useCountdown } from '@/hooks/use-countdown';
import AlertService from '@/services/alert.service';
import ProfileService, {
  ConfirmSignupPayload,
  EXPIRED_CODE_ERROR,
} from '@/services/profile.service';
import ToastService from '@/services/toast.service';
import { DefaultTheme } from '@/types';

const CODE_LENGTH = 6;
const RESEND_AFTER_SECONDS = 60;

const OnboardConfirmation: FC = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { remaining, isDone, restart } = useCountdown(RESEND_AFTER_SECONDS);

  const { control, handleSubmit, resetField } = useForm<ConfirmSignupPayload>({
    defaultValues: { code: '' },
  });
  const code = useWatch({ control, name: 'code' });

  const clearCode = () => resetField('code');

  const resend = useMutation({
    mutationFn: ProfileService.resendSignupCode,
  });

  const confirm = useMutation({
    mutationFn: (data: ConfirmSignupPayload) =>
      ProfileService.confirmSignup(data),
    onSuccess: () => {
      ToastService.success('Seu cadastro foi realizado com sucesso!');
      router.push('/onboard/onboard-apply');
    },
    onError: (error) => {
      clearCode();
      if (error.name !== EXPIRED_CODE_ERROR) {
        ToastService.error('Código inválido. Verifique e tente novamente.');
        return;
      }
      // Cognito doesn't send a new code on its own: ask for one, then tell the customer.
      resend.mutate(undefined, {
        onSuccess: () => {
          AlertService.error(
            'Código expirado',
            'Enviamos um novo código para o seu e-mail.',
            4,
          );
          restart();
        },
        onError: () =>
          ToastService.error(
            'Código expirado',
            'Não foi possível enviar um novo código. Tente novamente.',
          ),
      });
    },
  });

  const onResend = () =>
    resend.mutate(undefined, {
      onSuccess: () => {
        ToastService.success('Enviamos um novo código para o seu e-mail.');
        clearCode();
        restart();
      },
      onError: () =>
        ToastService.error(
          'Não foi possível enviar um novo código. Tente novamente.',
        ),
    });

  const isBusy = confirm.isPending || resend.isPending;
  const submit = handleSubmit((data) => confirm.mutate(data));

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <KeyboardAwareScrollView
        bottomOffset={20}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="headlineMedium">Confirme seu e-mail</Text>

        <View style={styles.content}>
          <Text variant="bodyLarge" style={styles.description}>
            Digite o código de {CODE_LENGTH} dígitos que enviamos para o seu
            e-mail.
          </Text>

          <CodeInput
            name="code"
            control={control}
            cellCount={CODE_LENGTH}
            editable={!isBusy}
            onFulfill={() => submit()}
            rules={{
              validate: (value) =>
                value.length === CODE_LENGTH ||
                `Informe os ${CODE_LENGTH} dígitos.`,
            }}
            testID="confirmation-code-input"
          />

          <View style={styles.resend}>
            {isDone ? (
              <Button
                mode="text"
                icon="email-sync-outline"
                onPress={onResend}
                loading={resend.isPending}
                disabled={isBusy}
              >
                Reenviar código
              </Button>
            ) : (
              <Text variant="bodyMedium" style={styles.description}>
                Reenviar código em {formatCountdown(remaining)}
              </Text>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => submit()}
          loading={confirm.isPending}
          disabled={code.length < CODE_LENGTH || isBusy}
        >
          Confirmar
        </Button>
        <Button onPress={() => router.back()} disabled={isBusy}>
          Voltar
        </Button>
      </View>
    </SafeAreaView>
  );
};

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      gap: 20,
    },
    description: {
      color: theme.colors.onSurfaceVariant,
    },
    resend: {
      minHeight: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttons: {
      gap: 8,
      padding: 16,
    },
  });

export default OnboardConfirmation;
