import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Masks } from 'react-native-mask-input';
import type { TextInputProps } from 'react-native-paper';
import { Switch as RNPSwitch, Text } from 'react-native-paper';

import TextInput from '@/components/form/text-input';

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
      <View style={styles.inputWrapper}>
        <TextInput
          keyboardType="phone-pad"
          {...props}
          name={name}
          control={control}
          rules={{
            minLength: { value: 10, message: 'Número de telefone inválido' },
            ...rules,
          }}
          mask={Masks.BRL_PHONE}
        />
      </View>
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
});

export default PhoneInput;
