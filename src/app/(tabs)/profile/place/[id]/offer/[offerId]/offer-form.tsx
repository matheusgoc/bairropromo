import { useLocalSearchParams } from 'expo-router';
import { FC } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const OfferForm: FC = () => {
  const { id, offerId } = useLocalSearchParams<{
    id: string;
    offerId: string;
  }>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Place ID: {id}</Text>
      <Text>Offer ID: {offerId}</Text>
      {/* TODO: Implement offer form */}
    </View>
  );
};

export default OfferForm;
