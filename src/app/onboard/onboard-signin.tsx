import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import TextInput from '@/components/form/text-input';

interface SignInForm {
  email: string;
  password: string;
}

const OnboardSignin = () => {
  const { control, handleSubmit } = useForm<SignInForm>();

  const onSubmit = handleSubmit((_data) => {
    router.dismiss();
    setTimeout(() => router.push('/onboard/onboard-apply'), 0);
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
          onPress={onSubmit}
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
          style={{ marginTop: 16 }}
        >
          Esqueci minha Senha!
        </Button>
        <Button onPress={onSignup} style={{ marginTop: 8 }}>
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
          labelStyle={{ fontSize: 16 }}
        >
          Acesse com Google
        </Button>
        <Button
          mode="outlined"
          icon="apple"
          onPress={() => {}}
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
