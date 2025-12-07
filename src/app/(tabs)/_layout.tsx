import { Tabs } from 'expo-router';
import { FC } from 'react';
import { Icon } from 'react-native-paper';

const TabsLayout: FC = () => {
  return (
    <Tabs initialRouteName="(offer)/offer-list">
      <Tabs.Screen
        name="(place)/place-list"
        options={{
          title: 'Bairro',
          tabBarIcon: ({ color, focused }) => (
            <Icon source="map-marker-multiple" color={color} size={24} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(offer)/offer-list"
        options={{
          title: 'Promoções',
          tabBarIcon: ({ color, focused }) => (
            <Icon source="percent" color={color} size={24} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(profile)/profile-menu"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Icon source="account-details" color={color} size={24} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
