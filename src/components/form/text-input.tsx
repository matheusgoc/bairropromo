import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import type { TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { HelperText, TextInput as PaperTextInput } from 'react-native-paper';

type TextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<PaperTextInputProps, 'value' | 'onChangeText' | 'onBlur'> & {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  rules?: ControllerProps<TFieldValues, TName>['rules'];
};

const TextInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  ...textInputProps
}: TextInputProps<TFieldValues, TName>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <View>
        <PaperTextInput
          mode="outlined"
          {...textInputProps}
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

export type { TextInputProps };
export default TextInput;
