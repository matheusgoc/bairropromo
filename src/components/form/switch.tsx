import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { HelperText, Switch as RNPSwitch, Text } from 'react-native-paper';

type SwitchInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  rules?: ControllerProps<TFieldValues, TName>['rules'];
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  color?: string;
  disabled?: boolean;
};

const Switch = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  label,
  labelStyle,
  containerStyle,
  color,
  disabled,
}: SwitchInputProps<TFieldValues, TName>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <View>
        <View style={[styles.row, containerStyle]}>
          <Text variant="bodyLarge" style={labelStyle}>
            {label}
          </Text>
          <RNPSwitch
            value={!!value}
            onValueChange={onChange}
            color={color}
            disabled={disabled}
          />
        </View>
        <HelperText type="error" visible={!!error} style={styles.error}>
          {error?.message}
        </HelperText>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  error: {
    marginTop: -4,
  },
});

export default Switch;
