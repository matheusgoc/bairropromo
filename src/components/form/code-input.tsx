import {
  ControllerProps,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';
import { Platform, StyleSheet, TextInputProps, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { HelperText, Text } from 'react-native-paper';

import useAppTheme from '@/hooks/use-app-theme';
import { DefaultTheme } from '@/types';

const AUTO_COMPLETE = Platform.select<TextInputProps['autoComplete']>({
  android: 'sms-otp',
  default: 'one-time-code',
});

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  rules?: ControllerProps<TFieldValues, TName>['rules'];
  /** Number of digits. Defaults to 6. */
  cellCount?: number;
  editable?: boolean;
  /** Called with the code once every cell is filled. */
  onFulfill?: (code: string) => void;
  testID?: string;
};

/** One cell per digit of a numeric confirmation code. */
const CodeInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  cellCount = 6,
  editable = true,
  onFulfill,
  testID,
}: Props<TFieldValues, TName>) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ name, control, rules });
  const code: string = value ?? '';

  const ref = useBlurOnFulfill({ value: code, cellCount });
  const [clearProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: onChange,
  });

  const handleChangeText = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, cellCount);
    onChange(digits);
    if (digits.length === cellCount && digits !== code) onFulfill?.(digits);
  };

  return (
    <View>
      <CodeField
        ref={ref}
        {...clearProps}
        value={code}
        onChangeText={handleChangeText}
        onBlur={onBlur}
        cellCount={cellCount}
        editable={editable}
        rootStyle={styles.root}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={AUTO_COMPLETE}
        testID={testID}
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            onLayout={getCellOnLayoutHandler(index)}
            style={[
              styles.cell,
              isFocused && styles.focusedCell,
              !!error && styles.errorCell,
              !editable && styles.disabledCell,
            ]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      <HelperText type="error" visible={!!error}>
        {error?.message}
      </HelperText>
    </View>
  );
};

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    root: {
      justifyContent: 'space-between',
      gap: 8,
    },
    cell: {
      flex: 1,
      maxWidth: 52,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
    },
    focusedCell: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    errorCell: {
      borderColor: theme.colors.error,
    },
    disabledCell: {
      opacity: 0.5,
    },
    cellText: {
      fontSize: 24,
      lineHeight: 30,
      color: theme.colors.onSurface,
      textAlign: 'center',
    },
  });

export default CodeInput;
