import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import TextInput from '@/components/form/text-input';
import { useAuth } from '@/hooks/use-auth';
import ProfileService, { SigninPayload } from '@/services/profile.service';
import ToastService from '@/services/toast.service';

const OnboardSignin = () => {
  const { signIn } = useAuth();
  const { control, handleSubmit } = useForm<SigninPayload>();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SigninPayload) => ProfileService.signin(data),
    onSuccess: ({ token }) => {
      signIn(token);
      router.dismiss();
      setTimeout(() => router.push('/onboard/onboard-apply'), 0);
    },
    onError: () => {
      ToastService.error('E-mail ou senha incorretos. Tente novamente.');
    },
  });

  const onSignup = () => {
    router.dismiss();
    setTimeout(() => router.push('/onboard/onboard-signup'), 0);
  };

  return (
    <SafeAreaView
      style={{
        gap: 10,
        marginTop: 40,
        marginHorizontal: 30,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
        <TextInput
          control={control}
          name="email"
          label="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          rules={{ required: 'Informe seu e-mail' }}
        />
        <TextInput
          control={control}
          name="password"
          label="Senha"
          secureTextEntry
          rules={{ required: 'Informe sua senha' }}
        />
        <Button
          mode="contained"
          icon="login"
          onPress={handleSubmit(
            (data) => mutate(data),
            () => ToastService.error('Dados incorretos!'),
          )}
          loading={isPending}
          disabled={isPending}
          style={{ marginTop: 16 }}
          labelStyle={{ fontSize: 16 }}
        >
          Acessar
        </Button>
        <Button
          onPress={() => {
            router.dismiss();
            setTimeout(() => router.push('/onboard/onboard-reset'), 0);
          }}
          disabled={isPending}
          style={{ marginTop: 16 }}
        >
          Esqueci minha Senha!
        </Button>
        <Button
          onPress={onSignup}
          disabled={isPending}
          style={{ marginTop: 8 }}
        >
          Não tenho Cadastro
        </Button>
        <Divider style={{ marginVertical: 12 }} />
        <Text
          variant="bodyLarge"
          style={{ textAlign: 'center', marginBottom: 8 }}
        >
          Ou
        </Text>
        <Button
          mode="outlined"
          icon="google"
          onPress={() => {}}
          disabled={isPending}
          labelStyle={{ fontSize: 16 }}
        >
          Acesse com Google
        </Button>
        <Button
          mode="outlined"
          icon="apple"
          onPress={() => {}}
          disabled={isPending}
          style={{ marginTop: 12 }}
          labelStyle={{ fontSize: 16 }}
        >
          Acesse com Apple
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default OnboardSignin;
