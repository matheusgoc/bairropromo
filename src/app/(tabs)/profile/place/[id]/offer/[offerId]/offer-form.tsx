import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ActivityIndicator, Button } from 'react-native-paper';

import SelectInput, { SelectOption } from '@/components/form/select-input';
import TextInput from '@/components/form/text-input';
import Dialog from '@/components/ui/dialog';
import { DATETIME_MASK } from '@/constants';
import { isoToMaskedDateTime, maskedToIsoDateTime } from '@/helpers';
import useAppTheme from '@/hooks/use-app-theme';
import { retryUnlessClientError } from '@/services/http.service';
import LocationService from '@/services/location.service';
import OfferService, { OfferPayload } from '@/services/offer.service';
import ToastService from '@/services/toast.service';
import { DefaultTheme } from '@/types';

const NONE_OPTION: SelectOption = { id: '', name: 'Todas' };

// Empty is fine (the date is optional); a filled date must be complete and real.
const validateDateTime = (value: string) =>
  !value || !!maskedToIsoDateTime(value) || 'Data inválida';

const validateEnd = (value: string, values: OfferFormValues) => {
  const valid = validateDateTime(value);
  if (valid !== true) return valid;
  const start = maskedToIsoDateTime(values.start);
  const end = maskedToIsoDateTime(value);
  return !start || !end || dayjs(end).isAfter(start)
    ? true
    : 'Término deve ser após o início';
};

interface OfferFormValues {
  title: string;
  start: string;
  end: string;
  locationId: string;
}

const OfferForm: FC = () => {
  const { id, offerId } = useLocalSearchParams<{
    id: string;
    offerId: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const isNew = offerId === 'new';

  const { data: offer, isPending: isLoading } = useQuery({
    queryKey: ['offer', id, offerId],
    queryFn: () => OfferService.get(id, offerId),
    enabled: !isNew,
    retry: retryUnlessClientError,
  });

  const { data: locationsData } = useQuery({
    queryKey: ['locations', id],
    queryFn: () => LocationService.list(id),
  });

  const locationOptions: SelectOption[] = [
    NONE_OPTION,
    ...(locationsData?.map((loc) => ({ id: loc.id, name: loc.name })) ?? []),
  ];

  const { control, handleSubmit, reset } = useForm<OfferFormValues>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      start: '',
      end: '',
      locationId: '',
    },
  });

  useEffect(() => {
    if (offer) {
      reset({
        title: offer.title,
        start: isoToMaskedDateTime(offer.start),
        end: isoToMaskedDateTime(offer.end),
        locationId: offer.location?.id ?? '',
      });
    }
  }, [offer, reset]);

  // Both place views render the place's and its locations' visible offers.
  const invalidateOfferQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['offers', id] });
    queryClient.invalidateQueries({ queryKey: ['place', id] });
    // Mark stale without refetching now: the form is closing, and the next
    // open would otherwise show cached data for up to `staleTime`.
    queryClient.invalidateQueries({
      queryKey: ['offer', id, offerId],
      refetchType: 'none',
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: OfferPayload) =>
      isNew
        ? OfferService.add(id, data)
        : OfferService.update(id, offerId, data),
    onSuccess: () => {
      invalidateOfferQueries();
      ToastService.success(`Oferta ${isNew ? 'adicionada' : 'atualizada'}!`);
      router.back();
    },
    onError: (e) => {
      ToastService.error(
        `Erro ao ${isNew ? 'adicionar' : 'atualizar'} oferta!`,
      );
      console.error(e);
    },
  });

  const isActive = offer?.status === 'active';

  const [toggleDialogVisible, setToggleDialogVisible] = useState(false);

  const { mutate: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: () =>
      isActive
        ? OfferService.disable(id, offerId)
        : OfferService.enable(id, offerId),
    onSuccess: (saved) => {
      invalidateOfferQueries();
      if (saved.status === 'expired') {
        ToastService.warn(
          'Oferta expirada!',
          'Altere a data de término para reativá-la.',
        );
      } else {
        ToastService.success(
          isActive ? 'Oferta desativada!' : 'Oferta ativada!',
        );
      }
      router.back();
    },
    onError: (e) => {
      ToastService.error(
        `Erro ao ${isActive ? 'desativar' : 'ativar'} oferta!`,
      );
      console.error(e);
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
      const payload: OfferPayload = {
        title: data.title,
        start: maskedToIsoDateTime(data.start),
        end: maskedToIsoDateTime(data.end),
        // The API fixes the location at creation; update ignores it.
        locationId: (isNew && data.locationId) || undefined,
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
      <TextInput
        name="title"
        control={control}
        rules={{ required: 'Título é obrigatório' }}
        label="Título"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.titleInput]}
      />
      <TextInput
        name="start"
        control={control}
        rules={{ validate: validateDateTime, deps: ['end'] }}
        mask={DATETIME_MASK}
        label="Início"
        placeholder="DD/MM/AAAA HH:MM"
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput
        name="end"
        control={control}
        rules={{ validate: validateEnd }}
        mask={DATETIME_MASK}
        label="Término"
        placeholder="DD/MM/AAAA HH:MM"
        keyboardType="number-pad"
        style={styles.input}
      />
      <SelectInput
        name="locationId"
        control={control}
        label="Unidade"
        options={locationOptions}
        disabled={!isNew}
        style={styles.input}
      />

      <View style={styles.buttonsContainer}>
        {!isNew && (
          <Button
            mode="contained"
            onPress={() => setToggleDialogVisible(true)}
            loading={isToggling}
            disabled={isPending || isToggling}
            buttonColor={isActive ? theme.colors.error : undefined}
            style={styles.button}
          >
            {isActive ? 'Desativar' : 'Ativar'}
          </Button>
        )}
        <Button
          mode="contained"
          onPress={() => onSubmit()}
          loading={isPending}
          disabled={isPending || isToggling}
          style={styles.button}
        >
          Salvar
        </Button>
      </View>

      <Dialog
        visible={toggleDialogVisible}
        onDismiss={() => setToggleDialogVisible(false)}
        mode={isActive ? 'danger' : 'default'}
        title={isActive ? 'Desativar oferta' : 'Ativar oferta'}
        message={
          isActive
            ? `Tem certeza que deseja desativar a oferta ${offer?.title ?? ''}?`
            : `Tem certeza que deseja ativar a oferta ${offer?.title ?? ''}?`
        }
        actions={[
          {
            label: 'Voltar',
            callback: () => setToggleDialogVisible(false),
          },
          {
            label: isActive ? 'Desativar' : 'Ativar',
            isPrimary: true,
            callback: () => {
              setToggleDialogVisible(false);
              toggleStatus();
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
    titleInput: {
      minHeight: 100,
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

export default OfferForm;
