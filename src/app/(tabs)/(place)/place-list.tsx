import { FC } from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

const PlaceList: FC = () => {
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
      <Icon source="map-marker-multiple" size={80} />
      <Text variant="headlineLarge">Bairro</Text>
      <Text variant="titleMedium" style={{ textAlign: 'center' }}>
        Lista dos locais mais próximos
      </Text>
    </View>
  );
};

export default PlaceList;
