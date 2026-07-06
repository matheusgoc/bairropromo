import { router } from 'expo-router';
import { FC } from 'react';
import { View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import useAppTheme from '@/hooks/use-app-theme';

const OnboardSuccess: FC = () => {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <Text
          variant="displaySmall"
          style={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          Parabéns!
        </Text>
        <Icon
          source="check-circle-outline"
          size={200}
          color={theme.colors.success}
        />
        <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
          Você faz parte do Bairro!
        </Text>
      </View>
      <View style={{ paddingBottom: 16 }}>
        <Button
          mode="contained"
          labelStyle={{ fontSize: 16 }}
          onPress={() => router.replace('/(tabs)/place/place-list')}
        >
          Aproveite as Ofertas
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default OnboardSuccess;
