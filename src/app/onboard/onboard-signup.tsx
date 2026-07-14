import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProfileFormInputs from '@/components/form/profile-form-inputs';
import { useAuth } from '@/hooks/use-auth';
import ProfileService, { ProfileFormPayload } from '@/services/profile.service';
import ToastService from '@/services/toast.service';

const OnboardSignup: FC = () => {
  const { signIn } = useAuth();

  const { control, handleSubmit } = useForm<ProfileFormPayload>({
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
    mutationFn: (data: ProfileFormPayload) => ProfileService.signup(data),
    onSuccess: ({ token }) => {
      signIn(token);
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
        <ProfileFormInputs control={control} />
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
  },
  buttons: {
    gap: 8,
    padding: 16,
  },
});

export default OnboardSignup;
