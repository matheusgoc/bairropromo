import { useLocalSearchParams } from 'expo-router';
import { FC } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const PlaceEdit: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Edit Place ID: {id}</Text>
      {/* TODO: Implement place edit form */}
    </View>
  );
};

export default PlaceEdit;
