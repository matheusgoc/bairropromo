import { Stack } from 'expo-router';
import { FC } from 'react';

const SharedLayout: FC = () => {
  return (
    <Stack>
      <Stack.Screen
        name="place-list"
        options={{ headerShown: false, title: 'Bairro' }}
      />
      <Stack.Screen name="place-view/[id]" options={{ title: 'Comércio' }} />
    </Stack>
  );
};

export default SharedLayout;
