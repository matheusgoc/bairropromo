import { Stack } from 'expo-router';
import { FC } from 'react';

const ProfileLayout: FC = () => {
  return (
    <Stack>
      <Stack.Screen
        name="profile-view"
        options={{ headerShown: false, title: 'Perfil' }}
      />
      <Stack.Screen
        name="place/place-list"
        options={{ title: 'Meus Locais' }}
      />
      <Stack.Screen name="place/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="place/[id]/place-view"
        options={{ title: 'Visualizar Local' }}
      />
      <Stack.Screen
        name="place/[id]/place-edit"
        options={{ title: 'Editar Local' }}
      />
    </Stack>
  );
};

export default ProfileLayout;
