import React, { FC, memo } from 'react';
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

import { DefaultTheme } from '@/types';
import FetchView, { FetchViewProps } from './fetch-view';

interface Props<ItemT = any>
  extends FlatListProps<ItemT>, Omit<FetchViewProps, 'children'> {
  hasNextPage: boolean;
  onRefresh: () => void;
}

const List: FC<Props> = ({
  hasNextPage,
  onRefresh,
  isEmpty,
  empty,
  isLoading,
  loading,
  ...props
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <FetchView
      isLoading={isLoading}
      loading={loading}
      isEmpty={isEmpty}
      empty={
        <ScrollView
          contentContainerStyle={styles.emptyRefreshScrollview}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={isLoading} />
          }
        >
          {empty}
        </ScrollView>
      }
    >
      <FlatList
        onEndReachedThreshold={0}
        ListFooterComponent={
          hasNextPage ? (
            <ActivityIndicator
              color={theme.colors.primary}
              style={styles.indicator}
            />
          ) : (
            <Text variant="titleMedium" style={styles.endOfListText}>
              Fim da Lista
            </Text>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        {...props}
      />
    </FetchView>
  );
};

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    indicator: { marginVertical: 20 },
    endOfListText: {
      textAlign: 'center',
      fontWeight: 'bold',
      marginVertical: 20,
      textTransform: 'uppercase',
      color: theme.colors.primary,
    },
    emptyRefreshScrollview: {
      flex: 1,
      justifyContent: 'center',
    },
  });

export default memo(List);
