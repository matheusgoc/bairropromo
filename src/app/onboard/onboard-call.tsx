import { router } from 'expo-router';
import { FC } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardCall: FC = () => (
  <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingHorizontal: 24 }}>
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 100,
      }}
    >
      <Text
        variant="displayMedium"
        style={{ fontWeight: 'bold', textAlign: 'center' }}
      >
        Quer fazer parte do clube de vantagens do seu Bairro?
      </Text>
      <View style={{ gap: 20, width: '100%', alignItems: 'center' }}>
        <Button
          mode="contained"
          style={{ width: '80%' }}
          onPress={() => router.push('/onboard/onboard-gate')}
          labelStyle={{ fontSize: 16 }}
        >
          Quero
        </Button>
        <Button
          style={{ width: '80%' }}
          onPress={() => router.replace('/(tabs)/place/place-list')}
          labelStyle={{ fontSize: 16 }}
        >
          Agora não
        </Button>
      </View>
    </View>
  </SafeAreaView>
);

export default OnboardCall;
