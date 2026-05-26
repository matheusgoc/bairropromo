import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button } from 'react-native-paper';

import SelectInput from '@/components/form/select-input';
import TextInput from '@/components/form/text-input';
import { CATEGORIES } from '@/constants';
import useAppTheme from '@/hooks/use-app-theme';
import CategoryModel from '@/models/category.model';
import PlaceService, { PlacePayload } from '@/services/place.service';
import ToastService from '@/services/toast.service';
import { DefaultTheme } from '@/types';

const PlaceForm: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const isNew = id === 'new';

  const { data: place } = useQuery({
    queryKey: ['place', id],
    queryFn: () => PlaceService.get(id),
    enabled: !isNew,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PlacePayload) =>
      isNew ? PlaceService.add(data) : PlaceService.update(id, data),
    onSuccess: () => {
      ToastService.success(`Local ${isNew ? 'adicionado' : 'atualizado'}!`);
      router.back();
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
        category: (place.category as CategoryModel)?.id ?? '',
      });
    }
  }, [place, reset]);

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
          options={CATEGORIES}
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
          onPress={handleSubmit((data) => mutate(data))}
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
