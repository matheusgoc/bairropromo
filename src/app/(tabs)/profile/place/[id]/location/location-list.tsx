import { useLocalSearchParams } from 'expo-router';
import { FC } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const LocationList: FC = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Place ID: {id}</Text>
      {/* TODO: Implement location list */}
    </View>
  );
};

export default LocationList;
