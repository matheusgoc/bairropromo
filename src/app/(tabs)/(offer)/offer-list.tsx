import { FC } from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

const OfferList: FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 200,
        margin: 'auto',
      }}
    >
      <Icon source="percent" size={80} />
      <Text variant="headlineLarge">Promoções</Text>
      <Text variant="titleMedium" style={{ textAlign: 'center' }}>
        Lista de ofertas assinadas pelo consumidor
      </Text>
    </View>
  );
};

export default OfferList;
