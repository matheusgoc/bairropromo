import { FC } from 'react';
import { Pressable } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const OptionCard: FC<Props> = ({ label, selected, onPress }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: selected ? theme.colors.primary : theme.colors.outline,
        backgroundColor: selected
          ? theme.colors.primaryContainer
          : theme.colors.surface,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon
        source={selected ? 'radiobox-marked' : 'radiobox-blank'}
        size={24}
        color={selected ? theme.colors.primary : theme.colors.outline}
      />
      <Text
        variant="bodyLarge"
        style={{
          color: selected
            ? theme.colors.onPrimaryContainer
            : theme.colors.onSurface,
          fontWeight: selected ? 'bold' : 'normal',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default OptionCard;
