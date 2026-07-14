import { Stack, useRouter } from 'expo-router';
import { FC } from 'react';
import { Pressable } from 'react-native';
import { Icon } from 'react-native-paper';

const ProfileLayout: FC = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="profile-view"
        options={{ headerShown: false, title: 'Perfil' }}
      />
      <Stack.Screen name="profile-form" options={{ title: 'Minha Conta' }} />
      <Stack.Screen
        name="place/place-list"
        options={{
          title: 'Meus Locais',
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/profile/place/[id]/place-form',
                  params: {
                    id: 'new',
                  },
                })
              }
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                padding: 6,
              })}
            >
              <Icon source="plus" size={24} />
            </Pressable>
          ),
        }}
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
        options={({ route }) => ({
          title: 'Unidades',
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname:
                    '/(tabs)/profile/place/[id]/location/[locationId]/location-form',
                  params: {
                    id: (route.params as { id?: string })?.id ?? '',
                    locationId: 'new',
                  },
                })
              }
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                padding: 6,
              })}
            >
              <Icon source="plus" size={24} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="place/[id]/location/[locationId]/location-form"
        options={{ title: 'Editar Unidade' }}
      />
      <Stack.Screen
        name="place/[id]/offer/offer-list"
        options={({ route }) => ({
          title: 'Ofertas',
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname:
                    '/(tabs)/profile/place/[id]/offer/[offerId]/offer-form',
                  params: {
                    id: (route.params as { id?: string })?.id ?? '',
                    offerId: 'new',
                  },
                })
              }
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                padding: 6,
              })}
            >
              <Icon source="plus" size={24} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="place/[id]/offer/[offerId]/offer-form"
        options={{ title: 'Editar Oferta' }}
      />
    </Stack>
  );
};

export default ProfileLayout;
