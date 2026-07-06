import { router } from 'expo-router';
import { FC, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import OptionCard from '@/components/ui/option-card';

const OnboardGate: FC = () => {
  const [option, setOption] = useState<'no' | 'yes' | null>(null);

  return (
    <SafeAreaView>
      <View
        style={{
          height: '100%',
          justifyContent: 'space-between',
          padding: 20,
        }}
      >
        <View
          style={{
            height: 200,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Text
            variant="displaySmall"
            style={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            Seja bem-vindo(a)
          </Text>
          <Text
            variant="displaySmall"
            style={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            ao Bairro!
          </Text>
        </View>
        <View style={{ gap: 20 }}>
          <Text variant="headlineSmall">Você já tem cadastro?</Text>
          <View style={{ gap: 12 }}>
            <OptionCard
              label="Ainda não"
              selected={option === 'no'}
              onPress={() => setOption('no')}
            />
            <OptionCard
              label="Sim, já tenho"
              selected={option === 'yes'}
              onPress={() => setOption('yes')}
            />
          </View>
        </View>
        <View style={{ gap: 20 }}>
          {option && (
            <Button
              mode="contained"
              onPress={() =>
                option === 'yes'
                  ? router.push('/onboard/onboard-signin')
                  : router.push('/onboard/onboard-signup')
              }
              labelStyle={{ fontSize: 16 }}
            >
              {option === 'no' ? 'Criar meu Cadastro' : 'Acessar meu Cadastro'}
            </Button>
          )}

          <Button onPress={() => router.back()} labelStyle={{ fontSize: 16 }}>
            Voltar
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardGate;
