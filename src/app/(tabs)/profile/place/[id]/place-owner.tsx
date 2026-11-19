import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { FC, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';

import Dialog from '@/components/ui/dialog';
import EmptyState from '@/components/ui/empty-state';
import useAppTheme from '@/hooks/use-app-theme';
import PlaceOwnerModel from '@/models/place-owner.model';
import { HttpError, retryUnlessClientError } from '@/services/http.service';
import PlaceService from '@/services/place.service';
import ToastService from '@/services/toast.service';
import { DefaultTheme } from '@/types';

const isHttpStatus = (e: Error, ...statuses: number[]) =>
  e instanceof HttpError && statuses.includes(e.status);

// ─── Owner List Item ─────────────────────────────────────────────────────────

interface OwnerItemProps {
  owner: PlaceOwnerModel;
  onRemove: (owner: PlaceOwnerModel) => void;
  disabled: boolean;
  theme: DefaultTheme;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const OwnerItem: FC<OwnerItemProps> = ({
  owner,
  onRemove,
  disabled,
  theme,
}) => (
  <List.Item
    title={owner.name}
    description={owner.email}
    titleStyle={{ color: theme.colors.onSurface }}
    descriptionStyle={{ color: theme.colors.outline }}
    left={() => (
      <Avatar.Text
        size={42}
        label={getInitials(owner.name)}
        style={{
          backgroundColor: theme.colors.primaryContainer,
          alignSelf: 'center',
          marginLeft: 8,
        }}
        labelStyle={{ color: theme.colors.onPrimaryContainer }}
      />
    )}
    right={() => (
      <IconButton
        icon="account-remove"
        iconColor={theme.colors.error}
        size={25}
        onPress={() => onRemove(owner)}
        disabled={disabled}
      />
    )}
  />
);

// ─── Place Owner Screen ───────────────────────────────────────────────────────

const PlaceOwner: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [foundOwner, setFoundOwner] = useState<PlaceOwnerModel | null>(null);
  const [ownerToRemove, setOwnerToRemove] = useState<PlaceOwnerModel | null>(
    null,
  );
  const [associateDialogVisible, setAssociateDialogVisible] = useState(false);
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);

  const {
    data: owners = [],
    isPending: isLoadingOwners,
    isError: isOwnersError,
    isRefetching: isRefetchingOwners,
    refetch: refetchOwners,
  } = useQuery({
    queryKey: ['place-owners', id],
    queryFn: () => PlaceService.listOwners(id),
    retry: retryUnlessClientError,
  });

  const invalidateOwners = () =>
    queryClient.invalidateQueries({ queryKey: ['place-owners', id] });

  const { mutate: findOwner, isPending: isSearching } = useMutation({
    mutationFn: (searchEmail: string) =>
      PlaceService.findOwner(id, searchEmail),
    onSuccess: (owner) => {
      setFoundOwner(owner);
      setAssociateDialogVisible(true);
    },
    onError: (e) => {
      if (isHttpStatus(e, 404)) {
        ToastService.error('Nenhuma pessoa encontrada!');
      } else if (isHttpStatus(e, 409)) {
        ToastService.warn('Essa pessoa já é proprietária deste local!');
      } else {
        ToastService.error('Erro ao buscar proprietário!');
        console.error(e);
      }
    },
  });

  const { mutate: grantOwner, isPending: isGranting } = useMutation({
    mutationFn: (ownerId: string) => PlaceService.grantOwner(id, ownerId),
    onSuccess: () => {
      invalidateOwners();
      ToastService.success('Proprietário associado com sucesso!');
      setEmail('');
      setFoundOwner(null);
    },
    onError: (e) => {
      setFoundOwner(null);
      if (isHttpStatus(e, 409)) {
        // Someone else granted them meanwhile: the list is stale.
        invalidateOwners();
        ToastService.warn('Essa pessoa já é proprietária deste local!');
      } else {
        ToastService.error('Erro ao associar proprietário!');
        console.error(e);
      }
    },
  });

  const { mutate: revokeOwner, isPending: isRevoking } = useMutation({
    mutationFn: (ownerId: string) => PlaceService.revokeOwner(id, ownerId),
    onSuccess: () => {
      invalidateOwners();
      ToastService.success('Proprietário removido!');
      setOwnerToRemove(null);
    },
    onError: (e) => {
      setOwnerToRemove(null);
      if (isHttpStatus(e, 403)) {
        ToastService.error(
          'Apenas um administrador pode remover o criador do local!',
        );
        return;
      }
      // 404 (no longer an owner) / 409 (owners changed): the list is stale.
      if (isHttpStatus(e, 404, 409)) invalidateOwners();
      ToastService.error('Erro ao remover proprietário!');
      console.error(e);
    },
  });

  const handleSearch = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      ToastService.error('Informe um e-mail para buscar.');
      return;
    }
    findOwner(trimmed);
  };

  const handleRemovePress = (owner: PlaceOwnerModel) => {
    setOwnerToRemove(owner);
    setRemoveDialogVisible(true);
  };

  const isBusy = isSearching || isGranting || isRevoking;

  return (
    <View style={styles.container}>
      {/* ── Search ── */}
      <Surface style={styles.searchSurface} elevation={1}>
        <Text variant="titleSmall" style={styles.sectionSubtitle}>
          Informe o email de alguém que terá o perfil de administrador da seu
          local:
        </Text>
        <View style={styles.searchRow}>
          <TextInput
            mode="outlined"
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
            disabled={isBusy}
            right={
              email.length > 0 ? (
                <TextInput.Icon icon="close" onPress={() => setEmail('')} />
              ) : undefined
            }
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {isSearching ? (
            <ActivityIndicator style={styles.searchIconSlot} />
          ) : (
            <IconButton
              icon="account-search"
              mode="contained"
              size={26}
              onPress={handleSearch}
              disabled={isBusy}
              style={styles.searchIconSlot}
              containerColor={theme.colors.primary}
              iconColor={theme.colors.onPrimary}
            />
          )}
        </View>
      </Surface>

      <Divider />

      {/* ── Owners list ── */}
      <View style={styles.listHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Proprietários
        </Text>
      </View>

      {isLoadingOwners ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : isOwnersError ? (
        <View style={styles.centered}>
          <EmptyState
            icon="cloud-alert-outline"
            title="Erro ao carregar os proprietários!"
            subtitle="Verifique sua conexão e tente novamente."
          >
            <Button
              mode="contained"
              icon="refresh"
              loading={isRefetchingOwners}
              disabled={isRefetchingOwners}
              onPress={() => refetchOwners()}
            >
              Tentar novamente
            </Button>
          </EmptyState>
        </View>
      ) : owners.length === 0 ? (
        <View style={styles.centered}>
          <Avatar.Icon
            size={64}
            icon="account-off-outline"
            style={{ backgroundColor: theme.colors.surfaceVariant }}
            color={theme.colors.outline}
          />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.outline, marginTop: 12 }}
          >
            Nenhum outro proprietário associado.
          </Text>
        </View>
      ) : (
        <FlatList
          data={owners}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OwnerItem
              owner={item}
              onRemove={handleRemovePress}
              disabled={isBusy}
              theme={theme}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}

      {/* ── Associate dialog ── */}
      <Dialog
        visible={associateDialogVisible}
        onDismiss={() => {
          setAssociateDialogVisible(false);
          setFoundOwner(null);
        }}
        mode="default"
        title="Proprietário encontrado"
        message={`Encontramos ${foundOwner?.name ?? ''} (${foundOwner?.email ?? ''}). Gostaria de torná-lo proprietário deste local?`}
        actions={[
          {
            label: 'Cancelar',
            callback: () => {
              setAssociateDialogVisible(false);
              setFoundOwner(null);
            },
          },
          {
            label: 'Associar',
            isPrimary: true,
            callback: () => {
              setAssociateDialogVisible(false);
              if (foundOwner) grantOwner(foundOwner.id);
            },
          },
        ]}
      />

      {/* ── Remove dialog ── */}
      <Dialog
        visible={removeDialogVisible}
        onDismiss={() => {
          setRemoveDialogVisible(false);
          setOwnerToRemove(null);
        }}
        mode="danger"
        title="Remover proprietário"
        message={`Tem certeza que deseja remover ${ownerToRemove?.name ?? ''} da loja?`}
        actions={[
          {
            label: 'Cancelar',
            callback: () => {
              setRemoveDialogVisible(false);
              setOwnerToRemove(null);
            },
          },
          {
            label: 'Remover',
            isPrimary: true,
            callback: () => {
              setRemoveDialogVisible(false);
              if (ownerToRemove) revokeOwner(ownerToRemove.id);
            },
          },
        ]}
      />
    </View>
  );
};

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    searchSurface: {
      padding: 16,
      gap: 12,
      backgroundColor: theme.colors.surface,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    searchInput: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    searchIconSlot: {
      marginTop: 4,
    },
    sectionTitle: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    sectionSubtitle: {
      color: theme.colors.primary,
    },
    listHeader: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      gap: 8,
    },
  });

export default PlaceOwner;
