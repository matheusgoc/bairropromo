import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Badge, useTheme } from 'react-native-paper';

import OfferModel from '@/models/offer.model';

const statusLabel: Record<OfferModel['status'], string> = {
  canceled: 'promoção cancelada',
  expired: 'promoção encerrada',
  used: 'promoção utilizada',
  active: 'ativa',
};

const OfferStatusBadge = ({ status }: { status: OfferModel['status'] }) => {
  const styles = useStatusBadgeStyles();
  return <Badge style={styles.badge}>{statusLabel[status]}</Badge>;
};

const useStatusBadgeStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    badge: {
      fontSize: 12,
      backgroundColor: theme.colors.outline,
      alignSelf: 'flex-start',
      marginHorizontal: 10,
      marginBottom: 10,
      marginLeft: 75,
      paddingHorizontal: 20,
    },
  });
};

export default memo(OfferStatusBadge);
