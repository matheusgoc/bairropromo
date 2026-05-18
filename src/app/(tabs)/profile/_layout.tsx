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
      <Stack.Screen name="place/[id]/place-view" options={{ title: 'Local' }} />
      <Stack.Screen
        name="place/[id]/place-form"
        options={{ title: 'Editar Local' }}
      />
      <Stack.Screen
        name="place/[id]/place-owner"
        options={{ title: 'Definir Dono' }}
      />
      <Stack.Screen
        name="place/[id]/location/location-list"
        options={{ title: 'Unidades' }}
      />
      <Stack.Screen
        name="place/[id]/location/[locationId]/location-form"
        options={{ title: 'Editar Location' }}
      />
      <Stack.Screen
        name="place/[id]/offer/offer-list"
        options={{ title: 'Ofertas' }}
      />
      <Stack.Screen
        name="place/[id]/offer/[offerId]/offer-form"
        options={{ title: 'Editar Oferta' }}
      />
    </Stack>
  );
};

export default ProfileLayout;
