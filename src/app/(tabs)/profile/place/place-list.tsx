import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { FC, memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Badge, Divider, List as RNPList } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/ui/empty-state';
import List from '@/components/ui/list';
import PlaceStatusBadge from '@/components/ui/place-status-badge';
import SkeletonCircle from '@/components/ui/skeleton/skeleton-circle';
import SkeletonText from '@/components/ui/skeleton/skeleton-text';
import { extractInitials } from '@/helpers';
import useAppTheme from '@/hooks/use-app-theme';
import PlaceModel, { PlaceStatus } from '@/models/place.model';
import PlaceService from '@/services/place.service';
import { DefaultTheme } from '@/types';

const PlaceList: FC = () => {
  const { profile } = useLocalSearchParams<{ profile: string }>();

  const {
    data: places,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['places', 'owner', profile],
    queryFn: () => PlaceService.list(1, { ownerId: profile }),
    enabled: !!profile,
  });

  if (!profile) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']}>
        <EmptyState title="Erro" subtitle="Profile ID não fornecido" />
      </SafeAreaView>
    );
  }

  return (
    <View>
      <List
        data={places?.data ?? []}
        hasNextPage={false}
        keyExtractor={(place: PlaceModel) => place.id}
        renderItem={({ item }: { item: PlaceModel }) => (
          <PlaceItem place={item} profile={profile} />
        )}
        onRefresh={refetch}
        isLoading={isPending || isRefetching}
        loading={<LoadingSkeleton />}
        isEmpty={(places?.data ?? []).length === 0}
        empty={
          <EmptyState
            title="Nenhum local encontrado"
            subtitle="Você não possui nenhum local cadastrado ainda."
          />
        }
      />
    </View>
  );
};

interface PlaceItemProps {
  place: PlaceModel;
  profile: string;
}

const PlaceItem: FC<PlaceItemProps> = memo(({ place, profile }) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const handlePress = () => {
    router.navigate({
      pathname: '/profile/place/[id]/place-view',
      params: { id: place.id },
    });
  };

  return (
    <RNPList.Item
      title={place.name}
      titleNumberOfLines={1}
      description={() => (
        <View style={styles.description}>
          <Text style={styles.category}>{place.category?.name}</Text>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            {![PlaceStatus.ACTIVE, PlaceStatus.DRAFT].includes(
              place.status,
            ) && <PlaceStatusBadge status={place.status} />}
          </View>
        </View>
      )}
      onPress={handlePress}
      left={() =>
        place.logo ? (
          <Image
            source={place.logo}
            style={styles.logo}
            contentFit="cover"
            alt={`Logo de ${place.name}`}
          />
        ) : (
          <Avatar.Text size={50} label={extractInitials(place.name)} />
        )
      }
      right={() => (
        <View style={styles.right}>
          <Badge
            style={{
              backgroundColor: place.published
                ? theme.colors.success
                : theme.colors.error,
            }}
          />
          <RNPList.Icon icon="chevron-right" />
        </View>
      )}
      style={styles.item}
    />
  );
});

PlaceItem.displayName = 'PlaceItem';

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    item: {
      backgroundColor: theme.colors.surface,
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 50,
      margin: 8,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
    description: {
      gap: 4,
      alignItems: 'flex-start',
    },
    category: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
  });

const LoadingSkeleton: FC = memo(() => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  return (
    <ScrollView>
      {Array.from({ length: 15 }).map((_, i) => (
        <View key={i}>
          <View style={{ flexDirection: 'row', gap: 10, margin: 10 }}>
            <SkeletonCircle size={50} />
            <View style={{ gap: 10, width: '70%', justifyContent: 'center' }}>
              <SkeletonText width="60%" height={16} />
              <SkeletonText width="100%" height={10} />
            </View>
            <View style={{ alignSelf: 'center' }}>
              <View style={styles.right}>
                <Badge
                  style={{ backgroundColor: theme.colors.surfaceVariant }}
                />
                <RNPList.Icon icon="chevron-right" />
              </View>
            </View>
          </View>
          <Divider />
        </View>
      ))}
    </ScrollView>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default PlaceList;
