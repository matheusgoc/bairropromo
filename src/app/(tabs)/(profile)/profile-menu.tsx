import { FC } from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

const ProfileMenu: FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 200,
        margin: 'auto',
      }}
    >
      <Icon source="account-details" size={80} />
      <Text variant="headlineLarge">Perfil</Text>
      <Text variant="titleMedium" style={{ textAlign: 'center' }}>
        Informações do usuário e gestão de locais
      </Text>
    </View>
  );
};

export default ProfileMenu;
