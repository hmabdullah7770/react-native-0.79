import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
import { useCategoryNames, useCategoryDataInfinite } from '../../../ReactQuery/TanStackQueryHooks/useCategories';
import Card from './Card';

const LIMIT = 5;
const PRELOAD_THRESHOLD = 2;

const Feed = () => {
  const { selectedCategoryIndex } = useSelector(state => state.category);
  const flashListRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Use the new normalized structure
  const { data, isLoading: isLoadingCategories, error: errorCategories } = useCategoryNames();
  const categories = data?.list || [];
  const total = data?.total || 0;

  // Memoize categories with 'All' at the top
  const categoriesWithAll = useMemo(() => [
    { id: '6834c7f5632a2871571413f7', name: 'All' },
    ...categories.filter(cat => cat.name?.toLowerCase() !== 'all')
  ], [categories]);

  const selectedCategoryName = categoriesWithAll[selectedCategoryIndex]?.name;

  // useCategoryDataInfinite now returns a flat array of cards as data
  const {
    data: allItems,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useCategoryDataInfinite(selectedCategoryName, LIMIT);

  useEffect(() => {
    if (selectedCategoryName && flashListRef.current) {
      flashListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [selectedCategoryName]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreData = async () => {
    if (!hasNextPage || isLoadingMore || isFetchingNextPage || refreshing) {
      return;
    }
    setIsLoadingMore(true);
    try {
      await fetchNextPage();
    } catch (error) {
      console.error('Error fetching next page:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (!hasNextPage || isLoadingMore || isFetchingNextPage || refreshing || !viewableItems?.length) {
      return;
    }
    const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
    const totalItems = allItems?.length || 0;
    if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
      loadMoreData();
    }
  };

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 30,
    minimumViewTime: 50,
  }), []);

  const renderItem = ({ item, index }) => (
    <Card item={item} index={index} />
  );

  const getItemType = () => 'card';

  const onEndReached = () => {
    if (hasNextPage && !isLoadingMore && !isFetchingNextPage && !refreshing) {
      loadMoreData();
    }
  };

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#1FFFA5']}
      tintColor="#1FFFA5"
      title="Pull to refresh"
      titleColor="#1FFFA5"
    />
  ), [refreshing]);

  if (isLoading || isLoadingCategories) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading feed...</Text>
      </View>
    );
  }

  if (error || errorCategories) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Error loading feed data: {(error || errorCategories).message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        ref={flashListRef}
        data={allItems}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        estimatedItemSize={280}
        getItemType={getItemType}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={LIMIT}
        windowSize={10}
        initialNumToRender={LIMIT}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={styles.contentContainer}
        refreshControl={refreshControl}
      />
      {(isFetchingNextPage || isLoadingMore) && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingMoreText}>Loading more...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingVertical: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#666',
  },
});

export default Feed;