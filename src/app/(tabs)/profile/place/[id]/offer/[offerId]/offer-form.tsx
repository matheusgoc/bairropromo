import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import useAppTheme from '@/hooks/use-app-theme';
import LocationService from '@/services/location.service';
import OfferService, { OfferPayload } from '@/services/offer.service';
import ToastService from '@/services/toast.service';
import { DefaultTheme } from '@/types';

const NONE_OPTION: SelectOption = { id: '', name: 'Todas' };

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
  });

  const { data: locationsData } = useQuery({
    queryKey: ['locations', id],
    queryFn: () => LocationService.list(1, id),
  });

  const locationOptions: SelectOption[] = [
    NONE_OPTION,
    ...(locationsData?.data.map((loc) => ({ id: loc.id, name: loc.name })) ??
      []),
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
        start: offer.start ?? '',
        end: offer.end ?? '',
        locationId: offer.location?.id ?? '',
      });
    }
  }, [offer, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: OfferPayload) =>
      isNew
        ? OfferService.add(id, data)
        : OfferService.update(id, offerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers', id] });
      ToastService.success(`Oferta ${isNew ? 'adicionada' : 'atualizada'}!`);
      router.back();
    },
  });

  const isActive = offer?.status === 'active';

  const [toggleDialogVisible, setToggleDialogVisible] = useState(false);

  const { mutate: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: () =>
      isActive
        ? OfferService.disable(id, offerId)
        : OfferService.enable(id, offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers', id] });
      ToastService.success(isActive ? 'Oferta desativada!' : 'Oferta ativada!');
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
      const payload: OfferPayload = {
        title: data.title,
        start: data.start || undefined,
        end: data.end || undefined,
        locationId: data.locationId || undefined,
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
        mask={DATETIME_MASK}
        label="Início"
        placeholder="DD/MM/AAAA HH:MM"
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput
        name="end"
        control={control}
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
          onPress={onSubmit}
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
