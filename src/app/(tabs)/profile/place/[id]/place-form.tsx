import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ActivityIndicator, Button } from 'react-native-paper';

import SelectInput from '@/components/form/select-input';
import TextInput from '@/components/form/text-input';
import PlaceErrorState from '@/components/ui/place-error-state';
import useAppTheme from '@/hooks/use-app-theme';
import CategoryService from '@/services/category.service';
import { retryUnlessClientError } from '@/services/http.service';
import PlaceService, { PlacePayload } from '@/services/place.service';
import ToastService from '@/services/toast.service';
import { DefaultTheme } from '@/types';

const PlaceForm: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const isNew = id === 'new';

  const {
    data: place,
    error: placeError,
    isPending: isPlacePending,
    isRefetching: isPlaceRefetching,
    refetch: refetchPlace,
  } = useQuery({
    queryKey: ['place', id],
    queryFn: () => PlaceService.get(id),
    enabled: !isNew,
    retry: retryUnlessClientError,
  });

  const {
    data: categories,
    error: categoriesError,
    isPending: isCategoriesPending,
    isRefetching: isCategoriesRefetching,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories', 'all'],
    // 'all' so a place whose category was disabled still shows it selected.
    queryFn: () => CategoryService.list('all'),
    retry: retryUnlessClientError,
  });

  const categoryOptions = (categories ?? []).filter(
    (c) => c.enabled || c.id === place?.category?.id,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PlacePayload) =>
      isNew ? PlaceService.add(data) : PlaceService.update(id, data),
    onSuccess: (saved) => {
      // Prefix match: covers the public ['places'] and profile ['places', filter] lists.
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: ['place', saved.id] });
      ToastService.success(`Local ${isNew ? 'adicionado' : 'atualizado'}!`);
      router.back();
    },
    onError: (e) => {
      ToastService.error(`Erro ao ${isNew ? 'adicionar' : 'atualizar'} local!`);
      console.error(e);
    },
  });

  const { control, handleSubmit, reset } = useForm<PlacePayload>({
    defaultValues: { name: '', description: '', website: '', category: '' },
  });

  useEffect(() => {
    if (place) {
      reset({
        name: place.name,
        description: place.description ?? '',
        website: place.website ?? '',
        category: place.category?.id ?? '',
      });
    }
  }, [place, reset]);

  // Render the form only once its options and values are in, so the place's
  // category shows up selected instead of a blank select.
  if (isCategoriesPending || (!isNew && isPlacePending)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!categories || (!isNew && !place)) {
    return (
      <PlaceErrorState
        error={placeError ?? categoriesError}
        isRetrying={isPlaceRefetching || isCategoriesRefetching}
        onRetry={() => {
          if (placeError) refetchPlace();
          if (categoriesError) refetchCategories();
        }}
        fallbackHref="/profile/place/place-list"
      />
    );
  }

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={80}
        contentContainerStyle={styles.container}
      >
        <TextInput
          name="name"
          control={control}
          rules={{ required: 'Nome é obrigatório' }}
          label="Nome"
          style={styles.input}
        />
        <SelectInput
          name="category"
          control={control}
          rules={{ required: 'Categoria é obrigatória' }}
          label="Categoria"
          options={categoryOptions}
          style={styles.input}
        />
        <TextInput
          name="description"
          control={control}
          label="Descrição"
          multiline
          numberOfLines={10}
          style={[styles.input, styles.descriptionInput]}
        />
        <TextInput
          name="website"
          control={control}
          rules={{
            pattern: { value: /^https?:\/\/.+/, message: 'URL inválida' },
          }}
          label="Website"
          keyboardType="url"
          autoCapitalize="none"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={() =>
            handleSubmit(
              (data) => mutate(data),
              () => ToastService.error('Dados incorretos!'),
            )()
          }
          loading={isPending}
          disabled={isPending}
          style={styles.button}
        >
          Salvar
        </Button>
      </KeyboardAwareScrollView>
    </>
  );
};

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 80,
      gap: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    descriptionInput: {
      minHeight: 220,
    },
    button: {
      position: 'absolute',
      bottom: 0,
      left: 16,
      right: 16,
    },
  });

export default PlaceForm;
