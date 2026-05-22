import { useState } from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  type TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  HelperText,
  List,
  Modal,
  TextInput as PaperTextInput,
  Portal,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

type Option = { id: string; name: string; description?: string };

type SelectInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  rules?: ControllerProps<TFieldValues, TName>['rules'];
  label: string;
  options: Option[];
  style?: StyleProp<TextStyle>;
};

const SelectInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  label,
  options,
  style,
}: SelectInputProps<TFieldValues, TName>) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedLabel = options.find((o) => o.id === value)?.name ?? '';

        return (
          <View>
            <TouchableRipple onPress={() => setVisible(true)}>
              <View pointerEvents="none">
                <PaperTextInput
                  mode="outlined"
                  label={label}
                  value={selectedLabel}
                  editable={false}
                  right={<PaperTextInput.Icon icon="chevron-down" />}
                  error={!!error}
                  style={style}
                />
              </View>
            </TouchableRipple>
            <HelperText type="error" visible={!!error} style={styles.error}>
              {error?.message}
            </HelperText>

            <Portal>
              <Modal
                visible={visible}
                onDismiss={() => setVisible(false)}
                contentContainerStyle={[
                  styles.modal,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <SafeAreaView edges={['bottom']}>
                  <ScrollView>
                    {options.map((option) => (
                      <List.Item
                        key={option.id}
                        title={option.name}
                        description={option.description}
                        onPress={() => {
                          onChange(option.id);
                          setVisible(false);
                        }}
                        right={
                          value === option.id
                            ? (props) => <List.Icon {...props} icon="check" />
                            : undefined
                        }
                      />
                    ))}
                  </ScrollView>
                </SafeAreaView>
              </Modal>
            </Portal>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  error: {
    marginTop: -4,
  },
  modal: {
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export type { SelectInputProps, Option as SelectOption };
export default SelectInput;
