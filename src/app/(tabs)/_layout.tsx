import { Tabs } from 'expo-router';
import { FC } from 'react';
import { Icon } from 'react-native-paper';

const TabsLayout: FC = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="place"
        options={{
          title: 'Bairro',
          tabBarIcon: ({ color }) => (
            <Icon source="map-marker-multiple" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="offer"
        options={{
          title: 'Promoções',
          tabBarIcon: ({ color }) => (
            <Icon source="percent" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/profile-view"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Icon source="account-details" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
