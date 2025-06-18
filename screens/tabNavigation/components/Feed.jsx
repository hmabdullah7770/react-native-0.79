// Updated Feed.jsx with Pull-to-Refresh functionality
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state

  // Get category names to determine selected category
  const { data: categoryResponse } = useCategoryNames();

  // Calculate selected category name
  const selectedCategoryName = useMemo(() => {
    console.log('🎯 Feed - Calculating selectedCategoryName');
    console.log('📊 categoryResponse:', categoryResponse);
    console.log('🔢 selectedCategoryIndex:', selectedCategoryIndex);
    
    if (!categoryResponse?.data?.messege) {
      console.log('⚠️ No messege in categoryResponse.data');
      return null;
    }
    
    const rawCategories = categoryResponse.data.messege;
    console.log('📋 Raw categories:', rawCategories);
    
    const filteredList = rawCategories.filter(cat => {
      const categoryName = cat.categoryname || cat.categouryname;
      return categoryName?.toLowerCase() !== 'all';
    });
    
    const categoriesWithAll = [
      { _id: '6834c7f5632a2871571413f7', categoryname: 'All' },
      ...filteredList,
    ];
    
    console.log('📋 Categories with All:', categoriesWithAll);
    
    const selectedCategory = categoriesWithAll[selectedCategoryIndex];
    const categoryName = selectedCategory?.categoryname || selectedCategory?.categouryname;
    
    console.log('✅ Selected category name:', categoryName);
    return categoryName;
  }, [categoryResponse, selectedCategoryIndex]);

  // Use infinite query for pagination
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch, // This will refetch the first page
    remove // This will clear the cache completely
  } = useCategoryDataInfinite(selectedCategoryName, LIMIT);

  // Add logging for query states
  useEffect(() => {
    console.log('📊 Feed Query States:');
    console.log('- selectedCategoryName:', selectedCategoryName);
    console.log('- isLoading:', isLoading);
    console.log('- error:', error);
    console.log('- data:', data);
    console.log('- hasNextPage:', hasNextPage);
    console.log('- isFetchingNextPage:', isFetchingNextPage);
    console.log('- refreshing:', refreshing);
  }, [selectedCategoryName, isLoading, error, data, hasNextPage, isFetchingNextPage, refreshing]);

  // Process all items from pages
  const allItems = useMemo(() => {
    console.log('🔄 Feed - Calculating allItems');
    console.log('📄 Raw data:', data);
    
    if (!data?.pages) {
      console.log('⚠️ No pages in data');
      return [];
    }
    
    const items = data.pages.reduce((acc, page) => {
      console.log('📃 Processing page:', page);
      
      let cards = [];
      
      if (page?.data?.messege?.cards) {
        cards = page.data.messege.cards;
        console.log('✅ Found cards in page.data.messege.cards:', cards.length);
      } else if (page?.messege?.cards) {
        cards = page.messege.cards;
        console.log('✅ Found cards in page.messege.cards:', cards.length);
      } else if (page?.cards) {
        cards = page.cards;
        console.log('✅ Found cards in page.cards:', cards.length);
      } else {
        console.log('⚠️ No cards found in page structure:', Object.keys(page || {}));
        console.log('🔍 Page data structure:', page);
      }
      
      console.log('🎴 Cards in this page:', cards?.length || 0);
      return [...acc, ...(cards || [])];
    }, []);
    
    console.log('✅ Total items:', items.length);
    return items;
  }, [data]);

  // Reset scroll position when category changes
  useEffect(() => {
    if (selectedCategoryName) {
      console.log('🔄 Category changed, scrolling to top');
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [selectedCategoryName]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    console.log('🔄 Pull-to-refresh triggered');
    setRefreshing(true);
    
    try {
      // Option 1: Just refetch the first page (keeps existing pages)
      await refetch();
      
      // Option 2: Clear cache and start fresh (uncomment if you want complete refresh)
      // remove();
      // await refetch();
      
      console.log('✅ Refresh completed successfully');
    } catch (error) {
      console.log('❌ Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Load more data function
  const loadMoreData = useCallback(async () => {
    console.log('📥 loadMoreData called');
    console.log('- hasNextPage:', hasNextPage);
    console.log('- isLoadingMore:', isLoadingMore);
    console.log('- isFetchingNextPage:', isFetchingNextPage);
    console.log('- refreshing:', refreshing);
    
    if (!hasNextPage || isLoadingMore || isFetchingNextPage || refreshing) {
      console.log('⚠️ Skipping loadMoreData - conditions not met');
      return;
    }
    
    setIsLoadingMore(true);
    try {
      console.log('🚀 Fetching next page...');
      const result = await fetchNextPage();
      console.log('✅ Next page fetched successfully:', result);
    } catch (error) {
      console.log('❌ Error fetching next page:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasNextPage, isLoadingMore, isFetchingNextPage, refreshing, fetchNextPage]);

  // Handle scroll-based preloading
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    console.log('👀 Viewable items changed:', viewableItems?.length);
    
    if (!hasNextPage || isLoadingMore || isFetchingNextPage || refreshing || !viewableItems?.length) {
      console.log('⚠️ Skipping preload - conditions not met');
      return;
    }
    
    const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
    const totalItems = allItems.length;
    
    console.log('📊 Preload check:', {
      lastVisibleIndex,
      totalItems,
      threshold: totalItems - PRELOAD_THRESHOLD,
      shouldLoad: totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD
    });
    
    if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
      console.log('🎯 Preload threshold reached, loading more data');
      loadMoreData();
    }
  }, [hasNextPage, isLoadingMore, isFetchingNextPage, refreshing, allItems.length, loadMoreData]);

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 30,
    minimumViewTime: 50,
  }), []);

  const renderItem = useCallback(({ item, index }) => {
    console.log(`🎴 Rendering item ${index}:`, item?._id);
    return <Card item={item} index={index} />;
  }, []);

  const getItemType = useCallback(() => 'card', []);

  const onEndReached = useCallback(() => {
    console.log('🏁 onEndReached called');
    if (hasNextPage && !isLoadingMore && !isFetchingNextPage && !refreshing) {
      console.log('🚀 Loading more data from onEndReached');
      loadMoreData();
    }
  }, [hasNextPage, isLoadingMore, isFetchingNextPage, refreshing, loadMoreData]);

  // Create RefreshControl component
  const refreshControl = useMemo(() => 
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#1FFFA5']} // Android
      tintColor="#1FFFA5" // iOS
      title="Pull to refresh" // iOS
      titleColor="#1FFFA5" // iOS
    />, 
    [refreshing, onRefresh]
  );

  if (isLoading) {
    console.log('🔄 Feed rendering loading state');
    return (
      <View style={styles.centerContainer}>
        <Text>Loading feed...</Text>
      </View>
    );
  }

  if (error) {
    console.log('❌ Feed rendering error state:', error);
    return (
      <View style={styles.centerContainer}>
        <Text>Error loading feed data: {error.message}</Text>
      </View>
    );
  }

  console.log('✅ Feed rendering with items:', allItems.length);

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
        // Add RefreshControl for pull-to-refresh
        refreshControl={refreshControl}
      />
      
      {(isFetchingNextPage || isLoadingMore) && (
        <View style={styles.loadingContainer}>
          <Text>Loading more...</Text>
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
  },
  contentContainer: {
    paddingVertical: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Feed;