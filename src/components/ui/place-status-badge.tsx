import { FC } from 'react';
import { Chip, useTheme } from 'react-native-paper';

import { PlaceStatus } from '@/models/place.model';

const STATUS_LABELS: Record<PlaceStatus, string> = {
  [PlaceStatus.DRAFT]: 'Rascunho',
  [PlaceStatus.REVIEWING]: 'Em Revisão',
  [PlaceStatus.ACTIVE]: 'Ativo',
  [PlaceStatus.PENDING]: 'Pendente',
  [PlaceStatus.BLOCKED]: 'Bloqueado',
};

interface Props {
  status: PlaceStatus;
}

const PlaceStatusBadge: FC<Props> = ({ status }) => {
  const { colors } = useTheme();

  const STATUS_COLORS: Record<PlaceStatus, { bg: string; text: string }> = {
    [PlaceStatus.DRAFT]: {
      bg: colors.surfaceVariant,
      text: colors.onSurfaceVariant,
    },
    [PlaceStatus.REVIEWING]: {
      bg: colors.secondaryContainer,
      text: colors.onSecondaryContainer,
    },
    [PlaceStatus.ACTIVE]: {
      bg: colors.primaryContainer,
      text: colors.onPrimaryContainer,
    },
    [PlaceStatus.PENDING]: {
      bg: colors.tertiaryContainer,
      text: colors.onTertiaryContainer,
    },
    [PlaceStatus.BLOCKED]: {
      bg: colors.errorContainer,
      text: colors.onErrorContainer,
    },
  };

  const { bg, text } = STATUS_COLORS[status];

  return (
    <Chip
      compact
      style={{ backgroundColor: bg }}
      textStyle={{ color: text, fontSize: 11, fontWeight: '600' }}
    >
      {STATUS_LABELS[status]}
    </Chip>
  );
};

export default PlaceStatusBadge;
