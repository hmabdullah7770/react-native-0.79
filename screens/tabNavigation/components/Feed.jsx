import React, { useState, useEffect, useCallback,useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { categouryrequest } from '../../../Redux/action/categoury';
import Card from './Card';

const LIMIT = 5;
const PRELOAD_THRESHOLD = 2; // Load next page when user reaches 3rd item (limit - 2)

const Feed = () => {
  const dispatch = useDispatch();
  const { categourydata } = useSelector((state) => state.categoury);
  const flashListRef = useRef(null);

  // State management
  const [allItems, setAllItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Extract data from API response
  const apiItems = categourydata?.messege?.cards || [];
  const pagination = categourydata?.messege?.pagination;

  // Handle initial data and pagination updates
  useEffect(() => {
    if (apiItems.length > 0 && pagination) {
      if (pagination.currentPage === 1) {
        // First page - replace all items
        setAllItems(apiItems);
      } else {
        // Subsequent pages - append items
        setAllItems(prev => {
          const existingIds = new Set(prev.map(item => item._id));
          const newItems = apiItems.filter(item => !existingIds.has(item._id));
          return [...prev, ...newItems];
        });
      }
      
      setCurrentPage(pagination.currentPage);
      setHasNextPage(pagination.hasNextPage);
      setIsLoading(false);
    }
  }, [apiItems, pagination]);

  // Reset data when category changes (detect from categourydata change)
  useEffect(() => {
    if (categourydata && pagination && pagination.currentPage === 1) {
      // This means a new category was selected
      setAllItems(apiItems);
      setCurrentPage(1);
      setHasNextPage(pagination.hasNextPage);
      setIsLoading(false);
      // Scroll to top when category changes
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [categourydata]);

  // Load more data function
  const loadMoreData = useCallback(() => {
    if (!hasNextPage || isLoading) return;
    
    setIsLoading(true);
    const nextPage = currentPage + 1;
    
    // Get current category from the last API response or default to 'All'
    const category = selectedCategory;
    dispatch(categouryrequest(category, LIMIT, nextPage));
  }, [hasNextPage, isLoading, currentPage, selectedCategory, dispatch]);

  // Handle scroll-based preloading
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (!hasNextPage || isLoading || viewableItems.length === 0) return;
    
    const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
    const totalItems = allItems.length;
    
    // Trigger load when user reaches the preload threshold (3rd item from end)
    if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
      loadMoreData();
    }
  }, [hasNextPage, isLoading, allItems.length, loadMoreData]);

  // Viewability config for preloading
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  };

  // Render item function
  const renderItem = useCallback(({ item, index }) => (
    <Card item={item} index={index} />
  ), []);

  // Get item type for FlashList optimization
  const getItemType = useCallback(() => 'card', []);

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
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={LIMIT}
        windowSize={10}
        initialNumToRender={LIMIT}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingVertical: 5,
  },
});

export default Feed;



// tack stack feed




// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { FlashList } from '@shopify/flash-list';
// import { useSelector } from 'react-redux';
// import { useCategoryNames, useCategoryDataInfinite } from '../hooks/useCategories';
// import Card from './Card';

// const LIMIT = 5;
// const PRELOAD_THRESHOLD = 2;

// const Feed = () => {
//   const { selectedCategoryIndex } = useSelector(state => state.category);
//   const flashListRef = useRef(null);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   // Get category names to determine selected category
//   const { data: categoryResponse } = useCategoryNames();

//   // Get selected category name
//   const selectedCategoryName = useMemo(() => {
//     if (!categoryResponse?.messege) return null;
    
//     const filteredList = categoryResponse.messege.filter(
//       cat => cat.categouryname.toLowerCase() !== 'all'
//     );
    
//     const categoriesWithAll = [
//       { _id: '6834c7f5632a2871571413f7', categouryname: 'All' },
//       ...filteredList,
//     ];
    
//     return categoriesWithAll[selectedCategoryIndex]?.categouryname;
//   }, [categoryResponse, selectedCategoryIndex]);

//   // Use infinite query for pagination
//   const {
//     data,
//     isLoading,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     refetch
//   } = useCategoryDataInfinite(selectedCategoryName, LIMIT);

//   // Flatten all pages data into single array
//   const allItems = useMemo(() => {
//     if (!data?.pages) return [];
    
//     return data.pages.reduce((acc, page) => {
//       const cards = page?.messege?.cards || [];
//       return [...acc, ...cards];
//     }, []);
//   }, [data]);

//   // Reset scroll position when category changes
//   useEffect(() => {
//     if (selectedCategoryName) {
//       flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
//     }
//   }, [selectedCategoryName]);

//   // Load more data function
//   const loadMoreData = useCallback(async () => {
//     if (!hasNextPage || isLoadingMore || isFetchingNextPage) return;
    
//     setIsLoadingMore(true);
//     try {
//       await fetchNextPage();
//     } finally {
//       setIsLoadingMore(false);
//     }
//   }, [hasNextPage, isLoadingMore, isFetchingNextPage, fetchNextPage]);

//   // Handle scroll-based preloading
//   const onViewableItemsChanged = useCallback(({ viewableItems }) => {
//     if (!hasNextPage || isLoadingMore || isFetchingNextPage || viewableItems.length === 0) return;
    
//     const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
//     const totalItems = allItems.length;
    
//     // Trigger load when user reaches the preload threshold
//     if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
//       loadMoreData();
//     }
//   }, [hasNextPage, isLoadingMore, isFetchingNextPage, allItems.length, loadMoreData]);

//   // Viewability config for preloading
//   const viewabilityConfig = useMemo(() => ({
//     itemVisiblePercentThreshold: 50,
//     minimumViewTime: 100,
//   }), []);

//   // Render item function
//   const renderItem = useCallback(({ item, index }) => (
//     <Card item={item} index={index} />
//   ), []);

//   // Get item type for FlashList optimization
//   const getItemType = useCallback(() => 'card', []);

//   if (isLoading) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text>Loading feed...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text>Error loading feed data</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlashList
//         ref={flashListRef}
//         data={allItems}
//         renderItem={renderItem}
//         keyExtractor={item => item._id}
//         estimatedItemSize={280}
//         getItemType={getItemType}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         showsVerticalScrollIndicator={false}
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={LIMIT}
//         windowSize={10}
//         initialNumToRender={LIMIT}
//         updateCellsBatchingPeriod={50}
//         contentContainerStyle={styles.contentContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   contentContainer: {
//     paddingVertical: 5,
//   },
// });

// export default Feed;
