import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button } from 'react-native-paper';

import ProfileFormInputs from '@/components/form/profile-form-inputs';
import ProfileService, { ProfileFormPayload } from '@/services/profile.service';
import ToastService from '@/services/toast.service';

const ProfileForm: FC = () => {
  const queryClient = useQueryClient();

  const { data: profile, isPending: isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: ProfileService.get,
  });

  const { control, handleSubmit, reset } = useForm<ProfileFormPayload>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      whatsapp: false,
      dob: '',
      gender: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone ?? '',
        whatsapp: false,
        dob: profile.dob ? dayjs(profile.dob).format('DDMMYYYY') : '',
        gender: profile.gender ?? '',
      });
    }
  }, [profile, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProfileFormPayload) => ProfileService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      ToastService.success('Perfil atualizado com sucesso!');
      router.back();
    },
    onError: () => {
      ToastService.error(
        'Não foi possível atualizar o perfil. Tente novamente.',
      );
    },
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView style={{ padding: 20 }}>
      <ProfileFormInputs control={control} />
      <Button
        mode="contained"
        onPress={handleSubmit(
          (data) => mutate(data),
          () => ToastService.error('Dados incorretos!'),
        )}
        loading={isPending}
        disabled={isPending}
        style={{ marginTop: 20 }}
        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
      >
        Salvar
      </Button>
    </KeyboardAwareScrollView>
  );
};

export default ProfileForm;
