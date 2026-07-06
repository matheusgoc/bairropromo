import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import PhoneInput from '@/components/form/phone-input';
import SelectInput from '@/components/form/select-input';
import TextInput from '@/components/form/text-input';
import { DATE_MASK } from '@/constants';
import useAppTheme from '@/hooks/use-app-theme';
import ProfileService, { SignupPayload } from '@/services/profile.service';
import ToastService from '@/services/toast.service';
import { DefaultTheme } from '@/types';

const GENDER_OPTIONS = [
  { id: 'm', name: 'Masculino' },
  { id: 'f', name: 'Feminino' },
  { id: 'n', name: 'Não Binário' },
  { id: 'o', name: 'Outro' },
  { id: 'p', name: 'Prefiro não responder' },
];

const OnboardSignup: FC = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const { control, handleSubmit } = useForm<SignupPayload>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      whatsapp: false,
      dob: '',
      gender: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SignupPayload) => ProfileService.signup(data),
    onSuccess: () => {
      ToastService.success('Cadastro realizado com sucesso!');
      router.push('/onboard/onboard-password');
    },
    onError: () => {
      ToastService.error(
        'Não foi possível realizar o cadastro. Tente novamente.',
      );
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <KeyboardAwareScrollView
        bottomOffset={20}
        contentContainerStyle={styles.container}
      >
        <Text variant="headlineMedium">Informe seus dados:</Text>
        <TextInput
          name="name"
          control={control}
          rules={{ required: 'Nome é obrigatório' }}
          label="Nome*"
          style={styles.input}
        />
        <TextInput
          name="email"
          control={control}
          rules={{
            required: 'E-mail é obrigatório',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'E-mail inválido',
            },
          }}
          label="E-mail*"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <PhoneInput
          name="phone"
          whatsappName="whatsapp"
          control={control}
          label="Telefone"
          style={styles.input}
        />
        <TextInput
          name="dob"
          control={control}
          label="Data de Nascimento"
          keyboardType="number-pad"
          mask={DATE_MASK}
          style={styles.input}
          rules={{
            validate: (value) => {
              if (!value) return true;
              if (value.length !== 8) return 'Data inválida';
              const day = parseInt(value.slice(0, 2), 10);
              const month = parseInt(value.slice(2, 4), 10);
              const year = parseInt(value.slice(4, 8), 10);
              const date = new Date(year, month - 1, day);
              return (
                (date.getFullYear() === year &&
                  date.getMonth() === month - 1 &&
                  date.getDate() === day) ||
                'Data inválida'
              );
            },
          }}
        />
        <SelectInput
          name="gender"
          control={control}
          label="Gênero"
          options={GENDER_OPTIONS}
          style={styles.input}
        />
      </KeyboardAwareScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={handleSubmit(
            (data) => mutate(data),
            () => ToastService.error('Dados incorretos!'),
          )}
          loading={isPending}
          disabled={isPending}
        >
          Cadastrar
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
      gap: 20,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    buttons: {
      gap: 8,
      padding: 16,
    },
  });

export default OnboardSignup;
