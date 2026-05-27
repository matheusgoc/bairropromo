import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import type { TextInputProps } from 'react-native-paper';
import {
  HelperText,
  TextInput as PaperTextInput,
  Switch as RNPSwitch,
  Text,
} from 'react-native-paper';

const PHONE_PATTERN = /^(?!.* {2})[\d\-. ()]+$/;

type PhoneInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TWhatsappName extends FieldPath<TFieldValues>,
> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur' | 'keyboardType'
> & {
  name: TName;
  whatsappName: TWhatsappName;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, TName>;
};

const PhoneInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TWhatsappName extends FieldPath<TFieldValues>,
>({
  name,
  whatsappName,
  control,
  rules,
  ...props
}: PhoneInputProps<TFieldValues, TName, TWhatsappName>) => (
  <View>
    <View style={styles.row}>
      <Controller
        name={name}
        control={control}
        rules={{
          pattern: {
            value: PHONE_PATTERN,
            message: 'Número de telefone inválido',
          },
          ...rules,
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View style={styles.inputWrapper}>
            <PaperTextInput
              mode="outlined"
              keyboardType="phone-pad"
              {...props}
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!error}
            />
            <HelperText
              type="error"
              visible={!!error}
              style={styles.helperText}
            >
              {error?.message}
            </HelperText>
          </View>
        )}
      />
      <Controller
        name={whatsappName}
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={styles.switchWrapper}>
            <Text variant="labelMedium">WhatsApp</Text>
            <RNPSwitch value={!!value} onValueChange={onChange} />
          </View>
        )}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  switchWrapper: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 10,
  },
  helperText: {
    marginTop: -4,
  },
});

export default PhoneInput;
