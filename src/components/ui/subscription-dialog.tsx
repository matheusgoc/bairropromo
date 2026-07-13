import { FC } from 'react';

import Dialog from '@/components/ui/dialog';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSubscribe: () => void;
}

const SubscriptionDialog: FC<Props> = ({ visible, onDismiss, onSubscribe }) => (
  <Dialog
    visible={visible}
    onDismiss={onDismiss}
    title="Faça parte do Bairro!"
    message="Você precisa assinar um plano para ter acesso as promoções!"
    mode="warning"
    actions={[
      {
        label: 'Agora não.',
        isPrimary: true,
        callback: () => {
          onDismiss();
        },
      },
      {
        label: 'Eu quero!',
        callback: () => {
          onDismiss();
          onSubscribe();
        },
      },
    ]}
  />
);

export default SubscriptionDialog;
