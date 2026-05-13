import { useLocalSearchParams } from 'expo-router';
import { FC } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const LocationView: FC = () => {
  const { id, locationId } = useLocalSearchParams<{
    id: string;
    locationId: string;
  }>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Place ID: {id}</Text>
      <Text>Location ID: {locationId}</Text>
      {/* TODO: Implement location view */}
    </View>
  );
};

export default LocationView;
