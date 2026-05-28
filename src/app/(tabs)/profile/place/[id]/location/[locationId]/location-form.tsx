import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FC, useEffect, useState } from 'react';
import { Control, FieldPath, useForm, useWatch } from 'react-hook-form';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Masks } from 'react-native-mask-input';
import { ActivityIndicator, Button, Divider, Text } from 'react-native-paper';

import PhoneInput from '@/components/form/phone-input';
import SelectInput from '@/components/form/select-input';
import Switch from '@/components/form/switch';
import TextInput from '@/components/form/text-input';
import Dialog from '@/components/ui/dialog';
import { BRAZIL_STATES } from '@/constants';
import useAppTheme from '@/hooks/use-app-theme';
import LocationService, { LocationPayload } from '@/services/location.service';
import ToastService from '@/services/toast.service';
import { DefaultTheme } from '@/types';

const WEEKDAYS = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

type WorkingHourField = {
  weekDay: string;
  enabled: boolean;
  start: string;
  end: string;
};

interface LocationFormValues {
  name: string;
  city: string;
  state: string;
  address: string;
  postalCode: string;
  phone: string;
  isWhatsapp: boolean;
  email: string;
  workingHours: WorkingHourField[];
}

// ─── Working Hour Row ────────────────────────────────────────────────────────

interface WorkingHourRowProps {
  index: number;
  weekDay: string;
  control: Control<LocationFormValues>;
  inputStyle: StyleProp<TextStyle>;
}

const WorkingHourRow: FC<WorkingHourRowProps> = ({
  index,
  weekDay,
  control,
  inputStyle,
}) => {
  const enabled = useWatch({
    control,
    name: `workingHours.${index}.enabled` as FieldPath<LocationFormValues>,
  }) as boolean;

  return (
    <View style={rowStyles.row}>
      <Switch
        name={`workingHours.${index}.enabled` as FieldPath<LocationFormValues>}
        control={control}
        label={weekDay}
        containerStyle={rowStyles.dayToggle}
      />
      {enabled && (
        <View style={rowStyles.timeRow}>
          <TextInput
            name={
              `workingHours.${index}.start` as FieldPath<LocationFormValues>
            }
            control={control}
            rules={{
              required: 'Obrigatório',
              pattern: {
                value: /^([01]\d|2[0-3]):[0-5]\d$/,
                message: 'Formato HH:MM',
              },
            }}
            label="Abertura"
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
            style={[inputStyle, rowStyles.timeInput]}
          />
          <TextInput
            name={`workingHours.${index}.end` as FieldPath<LocationFormValues>}
            control={control}
            rules={{
              required: 'Obrigatório',
              pattern: {
                value: /^([01]\d|2[0-3]):[0-5]\d$/,
                message: 'Formato HH:MM',
              },
            }}
            label="Fechamento"
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
            style={[inputStyle, rowStyles.timeInput]}
          />
        </View>
      )}
    </View>
  );
};

const rowStyles = StyleSheet.create({
  row: {
    gap: 4,
  },
  dayToggle: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
});

// ─── Location Form ───────────────────────────────────────────────────────────

const LocationForm: FC = () => {
  const { id, locationId } = useLocalSearchParams<{
    id: string;
    locationId: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const isNew = locationId === 'new';

  const { data: location, isPending: isLoading } = useQuery({
    queryKey: ['location', id, locationId],
    queryFn: () => LocationService.get(id, locationId),
    enabled: !isNew,
  });

  const { control, handleSubmit, reset } = useForm<LocationFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      city: '',
      state: '',
      address: '',
      postalCode: '',
      phone: '',
      isWhatsapp: false,
      email: '',
      workingHours: WEEKDAYS.map((weekDay) => ({
        weekDay,
        enabled: false,
        start: '08:00',
        end: '18:00',
      })),
    },
  });

  useEffect(() => {
    if (location) {
      reset({
        name: location.name,
        city: location.city,
        state: location.state,
        address: location.address,
        postalCode: location.postalCode,
        phone: location.phone ?? '',
        isWhatsapp: location.isWhatsapp ?? false,
        email: location.email ?? '',
        workingHours: WEEKDAYS.map((weekDay) => {
          const existing = location.workingHours.find(
            (wh) => wh.weekDay === weekDay,
          );
          return {
            weekDay,
            enabled: !!existing,
            start: existing?.start ?? '08:00',
            end: existing?.end ?? '18:00',
          };
        }),
      });
    }
  }, [location, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LocationPayload) =>
      isNew
        ? LocationService.add(id, data)
        : LocationService.update(id, locationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', id] });
      ToastService.success(`Unidade ${isNew ? 'adicionada' : 'atualizada'}!`);
      router.back();
    },
  });

  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);

  const { mutate: removeLocation, isPending: isRemoving } = useMutation({
    mutationFn: () => LocationService.remove(id, locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', id] });
      ToastService.success('Unidade removida!');
      router.back();
    },
  });

  if (!isNew && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const onSubmit = handleSubmit(
    (data) => {
      const payload: LocationPayload = {
        name: data.name,
        city: data.city,
        state: data.state,
        address: data.address,
        postalCode: data.postalCode,
        phone: data.phone || undefined,
        isWhatsapp: data.isWhatsapp,
        email: data.email || undefined,
        workingHours: data.workingHours
          .filter((wh) => wh.enabled)
          .map(({ weekDay, start, end }) => ({ weekDay, start, end })),
      };
      mutate(payload);
    },
    () => ToastService.error('Dados incorretos!'),
  );

  return (
    <KeyboardAwareScrollView
      bottomOffset={80}
      contentContainerStyle={styles.container}
    >
      {/* Basic info */}
      <TextInput
        name="name"
        control={control}
        rules={{ required: 'Nome é obrigatório' }}
        label="Nome"
        style={styles.input}
      />
      <TextInput
        name="city"
        control={control}
        rules={{ required: 'Cidade é obrigatória' }}
        label="Cidade"
        style={styles.input}
      />
      <SelectInput
        name="state"
        control={control}
        rules={{ required: 'Estado é obrigatório' }}
        label="Estado"
        options={BRAZIL_STATES}
        style={styles.input}
      />
      <TextInput
        name="address"
        control={control}
        rules={{ required: 'Endereço é obrigatório' }}
        label="Endereço"
        style={styles.input}
      />
      <TextInput
        name="postalCode"
        control={control}
        rules={{
          required: 'CEP é obrigatório',
          pattern: {
            value: /^\d{5}-?\d{3}$/,
            message: 'CEP inválido (ex: 01310-100)',
          },
        }}
        mask={Masks.ZIP_CODE}
        label="CEP"
        keyboardType="number-pad"
        style={styles.input}
      />

      {/* Contact */}
      <TextInput
        name="email"
        control={control}
        rules={{
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'E-mail inválido',
          },
        }}
        label="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      <PhoneInput
        name="phone"
        whatsappName="isWhatsapp"
        control={control}
        label="Telefone"
        style={styles.input}
      />

      {/* Working Hours */}
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Horários
        </Text>
        <Divider />
      </View>
      <View>
        {WEEKDAYS.map((weekDay, index) => (
          <WorkingHourRow
            key={weekDay}
            index={index}
            weekDay={weekDay}
            control={control}
            inputStyle={styles.input}
          />
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        {!isNew && (
          <Button
            mode="contained"
            onPress={() => setRemoveDialogVisible(true)}
            disabled={isPending || isRemoving}
            buttonColor="#B00020"
            style={styles.button}
          >
            Remover
          </Button>
        )}
        <Button
          mode="contained"
          onPress={onSubmit}
          loading={isPending}
          disabled={isPending || isRemoving}
          style={styles.button}
        >
          Salvar
        </Button>
      </View>

      <Dialog
        visible={removeDialogVisible}
        onDismiss={() => setRemoveDialogVisible(false)}
        mode="danger"
        title="Remover local"
        message={`Tem certeza que deseja remover o local ${location?.name ?? ''}?`}
        actions={[
          {
            label: 'Cancelar',
            callback: () => setRemoveDialogVisible(false),
          },
          {
            label: 'Remover',
            isPrimary: true,
            callback: () => {
              setRemoveDialogVisible(false);
              removeLocation();
            },
          },
        ]}
      />
    </KeyboardAwareScrollView>
  );
};

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      padding: 16,
      paddingBottom: 80,
      gap: 20,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    sectionHeader: {
      marginTop: 12,
      gap: 8,
    },
    sectionTitle: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    buttonsContainer: {
      position: 'absolute',
      bottom: 30,
      left: 16,
      right: 16,
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });

export default LocationForm;
