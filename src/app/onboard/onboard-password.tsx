import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Icon, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import TextInput from '@/components/form/text-input';
import useAppTheme from '@/hooks/use-app-theme';
import ProfileService, { PasswordPayload } from '@/services/profile.service';
import ToastService from '@/services/toast.service';
import { DefaultTheme } from '@/types';

interface PasswordForm {
  password: string;
  confirmPassword: string;
}

const CRITERIA = [
  { label: 'Mínimo de 8 caracteres', test: (v: string) => v.length >= 8 },
  {
    label: 'Uma letra maiúscula (A-Z)',
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    label: 'Uma letra minúscula (a-z)',
    test: (v: string) => /[a-z]/.test(v),
  },
  { label: 'Um número (0-9)', test: (v: string) => /[0-9]/.test(v) },
  {
    label: 'Um caractere especial (!@#$%...)',
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
] as const;

const getStrengthColor = (count: number) => {
  if (count <= 2) return '#EF4444';
  if (count <= 3) return '#F97316';
  if (count <= 4) return '#EAB308';
  return '#22C55E';
};

const getStrengthLabel = (count: number) => {
  if (count === 0) return '';
  if (count <= 2) return 'Fraca';
  if (count === 3) return 'Média';
  if (count === 4) return 'Forte';
  return 'Muito Forte';
};

const OnboardPassword: FC = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const { control, handleSubmit, watch } = useForm<PasswordForm>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password', '');

  const criteriaResult = useMemo(
    () => CRITERIA.map((c) => ({ label: c.label, met: c.test(password) })),
    [password],
  );

  const metCount = criteriaResult.filter((c) => c.met).length;
  const canSubmit = password.length >= 8 && metCount >= 4;

  const strengthColor = getStrengthColor(metCount);
  const strengthLabel = getStrengthLabel(metCount);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PasswordPayload) => ProfileService.setPassword(data),
    onSuccess: () => {
      router.push('/onboard/onboard-apply');
    },
    onError: () => {
      ToastService.error('Não foi possível definir a senha. Tente novamente.');
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <KeyboardAwareScrollView
        bottomOffset={20}
        contentContainerStyle={styles.container}
      >
        <Text variant="headlineMedium">Crie sua senha:</Text>
        <TextInput
          name="password"
          control={control}
          rules={{ required: 'Senha não informada.' }}
          label="Senha"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          name="confirmPassword"
          control={control}
          rules={{
            required: 'Confirmação de senha não informada.',
            validate: (value) =>
              value === password || 'As senha e confirmação não coincidem.',
          }}
          label="Confirmar Senha"
          secureTextEntry
          style={styles.input}
        />

        <View style={styles.strengthBarTrack}>
          <View
            style={[
              styles.strengthBarFill,
              {
                width: `${(metCount / CRITERIA.length) * 100}%`,
                backgroundColor:
                  password.length > 0 ? strengthColor : 'transparent',
              },
            ]}
          />
        </View>
        {password.length > 0 && (
          <Text variant="labelLarge" style={{ color: strengthColor }}>
            {strengthLabel}
          </Text>
        )}

        <View style={styles.criteriaContainer}>
          <Text variant="labelLarge" style={styles.criteriaTitle}>
            Sua senha deve conter:
          </Text>
          {criteriaResult.map((criterion) => (
            <View key={criterion.label} style={styles.criterionRow}>
              <Icon
                source={criterion.met ? 'check-circle' : 'circle-outline'}
                size={18}
                color={
                  criterion.met
                    ? theme.colors.success
                    : theme.colors.onSurfaceVariant
                }
              />
              <Text
                variant="bodyMedium"
                style={{
                  color: criterion.met
                    ? theme.colors.success
                    : theme.colors.onSurfaceVariant,
                }}
              >
                {criterion.label}
              </Text>
            </View>
          ))}
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={handleSubmit(({ password: pw }) => mutate({ password: pw }))}
          disabled={!canSubmit || isPending}
          loading={isPending}
        >
          Definir Senha
        </Button>
        <Button onPress={() => router.back()} disabled={isPending}>
          Voltar
        </Button>
      </View>
    </SafeAreaView>
  );
};

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      gap: 16,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    strengthBarTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.surfaceVariant,
      overflow: 'hidden',
    },
    strengthBarFill: {
      height: 8,
      borderRadius: 4,
    },
    criteriaContainer: {
      gap: 6,
    },
    criteriaTitle: {
      marginBottom: 4,
      color: theme.colors.onSurface,
    },
    criterionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 2,
    },
    buttons: {
      gap: 8,
      padding: 16,
    },
  });

export default OnboardPassword;
