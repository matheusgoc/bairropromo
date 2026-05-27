import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import type { TextInputProps } from 'react-native-paper';
import { HelperText, TextInput as PaperTextInput } from 'react-native-paper';

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> & {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  rules?: ControllerProps<TFieldValues, TName>['rules'];
};

const TextInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  ...props
}: Props<TFieldValues, TName>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <View>
        <PaperTextInput
          mode="outlined"
          {...props}
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={!!error}
        />
        <HelperText type="error" visible={!!error} style={styles.error}>
          {error?.message}
        </HelperText>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  error: {
    marginTop: -4,
  },
});

export default TextInput;
