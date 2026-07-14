import { Control } from 'react-hook-form';

import PhoneInput from '@/components/form/phone-input';
import SelectInput from '@/components/form/select-input';
import TextInput from '@/components/form/text-input';
import { DATE_MASK } from '@/constants';
import useAppTheme from '@/hooks/use-app-theme';
import { ProfileFormPayload } from '@/services/profile.service';

const GENDER_OPTIONS = [
  { id: 'M', name: 'Masculino' },
  { id: 'F', name: 'Feminino' },
  { id: 'N', name: 'Não Binário' },
  { id: 'O', name: 'Outro' },
  { id: 'U', name: 'Prefiro não responder' },
];

interface ProfileFormInputsProps {
  control: Control<ProfileFormPayload>;
}

const ProfileFormInputs = ({ control }: ProfileFormInputsProps) => {
  const theme = useAppTheme();
  const inputStyle = { backgroundColor: theme.colors.surface };

  return (
    <>
      <TextInput
        name="name"
        control={control}
        rules={{ required: 'Nome é obrigatório' }}
        label="Nome*"
        style={inputStyle}
      />
      <TextInput
        name="email"
        control={control}
        rules={{
          required: 'E-mail é obrigatório',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'E-mail inválido!',
          },
        }}
        label="E-mail*"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={inputStyle}
      />
      <PhoneInput
        name="phone"
        whatsappName="whatsapp"
        control={control}
        label="Telefone"
        style={inputStyle}
      />
      <TextInput
        name="dob"
        control={control}
        label="Data de Nascimento"
        keyboardType="number-pad"
        mask={DATE_MASK}
        style={inputStyle}
        rules={{
          pattern: {
            value: /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])(19|20)\d\d$/,
            message: 'Data inválida!',
          },
        }}
      />
      <SelectInput
        name="gender"
        control={control}
        label="Gênero"
        options={GENDER_OPTIONS}
        style={inputStyle}
      />
    </>
  );
};

export default ProfileFormInputs;
