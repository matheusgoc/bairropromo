import { Tabs } from 'expo-router';
import { FC } from 'react';
import { Icon } from 'react-native-paper';

const TabsLayout: FC = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="place"
        options={{
          // the tab stacks have no index route; since SDK 58 the URL alone picks the
          // first screen, so point each tab at its main screen explicitly
          href: '/place/place-list',
          title: 'Bairro',
          tabBarIcon: ({ color }) => (
            <Icon
              source="map-marker-multiple"
              color={color as string}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="offer"
        options={{
          href: '/offer/offer-list',
          title: 'Promoções',
          tabBarIcon: ({ color }) => (
            <Icon source="percent" color={color as string} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: '/profile/profile-view',
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Icon source="account-details" color={color as string} size={24} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
