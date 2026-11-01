import { Stack } from 'expo-router';
import { FC } from 'react';

const SharedLayout: FC = () => {
  return (
    <Stack screenOptions={{ headerTransparent: false }}>
      <Stack.Screen
        name="offer-list"
        options={{ headerShown: false, title: 'Promoções' }}
      />
      <Stack.Screen
        name="offer-code/[id]"
        options={{
          title: 'Código da Promoção',
          presentation: 'formSheet',
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
};

export default SharedLayout;
