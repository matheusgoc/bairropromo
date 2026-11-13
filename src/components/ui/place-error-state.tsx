import { Href, router } from 'expo-router';
import { FC, memo } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

import EmptyState from '@/components/ui/empty-state';
import { HttpError } from '@/services/http.service';

interface Props {
  error: Error | null;
  isRetrying: boolean;
  onRetry: () => void;
  /** Where "Voltar" goes when there is no screen to go back to (e.g. deep link). */
  fallbackHref: Href;
}

const PlaceErrorState: FC<Props> = ({
  error,
  isRetrying,
  onRetry,
  fallbackHref,
}) => {
  const notFound = error instanceof HttpError && error.status === 404;
  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace(fallbackHref);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}
      refreshControl={
        <RefreshControl onRefresh={onRetry} refreshing={isRetrying} />
      }
    >
      {notFound ? (
        <EmptyState
          icon="store-remove-outline"
          title="Local não encontrado!"
          subtitle="Ele pode ter sido removido."
        >
          <Button mode="contained" icon="arrow-left" onPress={goBack}>
            Voltar
          </Button>
        </EmptyState>
      ) : (
        <EmptyState
          icon="cloud-alert-outline"
          title="Erro ao carregar o local!"
          subtitle="Verifique sua conexão e tente novamente."
        >
          <Button
            mode="contained"
            icon="refresh"
            loading={isRetrying}
            disabled={isRetrying}
            onPress={onRetry}
          >
            Tentar novamente
          </Button>
        </EmptyState>
      )}
    </ScrollView>
  );
};

export default memo(PlaceErrorState);
