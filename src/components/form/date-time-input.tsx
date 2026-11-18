import dayjs from 'dayjs';
import { FC, useState } from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  HelperText,
  TextInput as PaperTextInput,
  TouchableRipple,
} from 'react-native-paper';
import {
  DatePickerModal,
  pt,
  registerTranslation,
  TimePickerModal,
} from 'react-native-paper-dates';

import { timeOf, withTime } from '@/helpers';
import type { TimeOfDay } from '@/types';

registerTranslation('pt', pt);

const LOCALE = 'pt';

const isSameTime = (a: TimeOfDay, b: TimeOfDay) =>
  a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds;

interface PickerFieldProps {
  label: string;
  value: string;
  icon: string;
  onPress: () => void;
  /** Shows a ✕ in place of `icon` that calls this instead of `onPress`. */
  onClear?: () => void;
  clearLabel: string;
  error?: boolean;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

/** A read-only outlined input that opens a picker when pressed. */
const PickerField: FC<PickerFieldProps> = ({
  label,
  value,
  icon,
  onPress,
  onClear,
  clearLabel,
  error,
  disabled,
  style,
  containerStyle,
}) => (
  <View style={containerStyle}>
    <TouchableRipple onPress={onPress} disabled={disabled}>
      <View pointerEvents="none">
        <PaperTextInput
          mode="outlined"
          label={label}
          value={value}
          editable={false}
          disabled={disabled}
          right={<PaperTextInput.Icon icon={onClear ? 'close' : icon} />}
          error={error}
          style={style}
        />
      </View>
    </TouchableRipple>
    {/* Outside the pointerEvents="none" wrapper so it receives touches. */}
    {onClear && !disabled && (
      <Pressable
        onPress={onClear}
        accessibilityRole="button"
        accessibilityLabel={clearLabel}
        style={styles.clear}
      />
    )}
  </View>
);

type ValidRange = { startDate?: Date; endDate?: Date };

type DateTimeInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  rules?: ControllerProps<TFieldValues, TName>['rules'];
  label: string;
  /** Time applied when the user picks a date but no time. */
  defaultTime: TimeOfDay;
  /** Days outside this range can't be picked (only the day part counts). */
  validRange?: ValidRange;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
};

/**
 * Optional date-time field (`Date | null`): a date field opening a calendar
 * and a time field opening a clock. The time defaults to `defaultTime`.
 */
const DateTimeInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  label,
  defaultTime,
  validRange,
  style,
  disabled,
}: DateTimeInputProps<TFieldValues, TName>) => {
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);

  // The calendar only compares days, so widen the bounds to whole days.
  const dayRange: ValidRange = {
    startDate: validRange?.startDate
      ? dayjs(validRange.startDate).startOf('day').toDate()
      : undefined,
    endDate: validRange?.endDate
      ? dayjs(validRange.endDate).endOf('day').toDate()
      : undefined,
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        const date = (value as Date | null | undefined) ?? null;

        const close = () => {
          setPicker(null);
          onBlur();
        };

        return (
          <View>
            <View style={styles.row}>
              <PickerField
                label={label}
                value={date ? dayjs(date).format('DD/MM/YYYY') : ''}
                icon="calendar"
                onPress={() => setPicker('date')}
                onClear={date ? () => onChange(null) : undefined}
                clearLabel={`Limpar ${label}`}
                error={!!error}
                disabled={disabled}
                style={style}
                containerStyle={styles.date}
              />
              <PickerField
                label="Hora"
                value={date ? dayjs(date).format('HH:mm') : ''}
                icon="clock-outline"
                onPress={() => setPicker('time')}
                onClear={
                  date && !isSameTime(timeOf(date), defaultTime)
                    ? () => onChange(withTime(date, defaultTime))
                    : undefined
                }
                clearLabel={`Redefinir hora de ${label}`}
                error={!!error}
                disabled={disabled || !date}
                style={style}
                containerStyle={styles.time}
              />
            </View>
            <HelperText type="error" visible={!!error} style={styles.error}>
              {error?.message}
            </HelperText>

            <DatePickerModal
              locale={LOCALE}
              mode="single"
              visible={picker === 'date'}
              date={date ?? undefined}
              validRange={dayRange}
              label={label}
              saveLabel="Salvar"
              onDismiss={close}
              onConfirm={({ date: picked }) => {
                close();
                if (picked) {
                  // A new day keeps the time already set, if any.
                  onChange(withTime(picked, date ? timeOf(date) : defaultTime));
                }
              }}
            />
            <TimePickerModal
              locale={LOCALE}
              visible={picker === 'time'}
              hours={date?.getHours() ?? defaultTime.hours}
              minutes={date?.getMinutes() ?? defaultTime.minutes}
              use24HourClock
              label="Selecionar hora"
              cancelLabel="Cancelar"
              confirmLabel="OK"
              onDismiss={close}
              onConfirm={({ hours, minutes }) => {
                close();
                if (!date) return;
                // Picking the default's hour and minute means the default
                // itself, e.g. 23:59 → 23:59:59 for an end date.
                const isDefault =
                  hours === defaultTime.hours &&
                  minutes === defaultTime.minutes;
                onChange(
                  withTime(date, {
                    hours,
                    minutes,
                    seconds: isDefault ? defaultTime.seconds : 0,
                  }),
                );
              }}
            />
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  date: {
    flex: 2,
  },
  time: {
    flex: 1,
  },
  // Covers the input's right icon (the outlined input is 56pt tall, under a
  // 6pt label notch).
  clear: {
    position: 'absolute',
    top: 6,
    right: 0,
    bottom: 0,
    width: 48,
  },
  error: {
    marginTop: -4,
  },
});

export type { DateTimeInputProps };
export default DateTimeInput;
