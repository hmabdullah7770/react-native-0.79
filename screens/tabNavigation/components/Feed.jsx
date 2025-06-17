// Fixed Feed.jsx - Corrected API response path
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  // Get category names to determine selected category
  const { data: categoryResponse } = useCategoryNames();

  // FIXED: Correct the path to access category data
  const selectedCategoryName = useMemo(() => {
    console.log('🎯 Feed - Calculating selectedCategoryName');
    console.log('📊 categoryResponse:', categoryResponse);
    console.log('🔢 selectedCategoryIndex:', selectedCategoryIndex);
    
    // FIXED: The correct path is categoryResponse.data.messege (removed extra .data)
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
    refetch
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
  }, [selectedCategoryName, isLoading, error, data, hasNextPage, isFetchingNextPage]);

  // FIXED: Correct the data path for processing pages
  const allItems = useMemo(() => {
    console.log('🔄 Feed - Calculating allItems');
    console.log('📄 Raw data:', data);
    
    if (!data?.pages) {
      console.log('⚠️ No pages in data');
      return [];
    }
    
    const items = data.pages.reduce((acc, page) => {
      console.log('📃 Processing page:', page);
      
      // FIXED: Based on your API response structure: response.data.messege.cards
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

  // Load more data function
  const loadMoreData = useCallback(async () => {
    console.log('📥 loadMoreData called');
    console.log('- hasNextPage:', hasNextPage);
    console.log('- isLoadingMore:', isLoadingMore);
    console.log('- isFetchingNextPage:', isFetchingNextPage);
    
    if (!hasNextPage || isLoadingMore || isFetchingNextPage) {
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
  }, [hasNextPage, isLoadingMore, isFetchingNextPage, fetchNextPage]);

  // Handle scroll-based preloading
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    console.log('👀 Viewable items changed:', viewableItems?.length);
    
    if (!hasNextPage || isLoadingMore || isFetchingNextPage || !viewableItems?.length) {
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
  }, [hasNextPage, isLoadingMore, isFetchingNextPage, allItems.length, loadMoreData]);

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
    if (hasNextPage && !isLoadingMore && !isFetchingNextPage) {
      console.log('🚀 Loading more data from onEndReached');
      loadMoreData();
    }
  }, [hasNextPage, isLoadingMore, isFetchingNextPage, loadMoreData]);

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