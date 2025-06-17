import React, { useMemo, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useCategoryNames } from '../../../ReactQuery/TanStackQueryHooks/useCategories';
import { setSelectedCategory } from '../../../Redux/action/categoury';

const CategoryList = () => {
  const dispatch = useDispatch();
  const { selectedCategoryIndex, error } = useSelector(state => state.category);
  
  const { data: categoryResponse, isLoading, error: queryError } = useCategoryNames();

  // Add detailed logging
  useEffect(() => {
    console.log('🎯 CategoryList mounted');
    console.log('📊 categoryResponse:', categoryResponse);
    console.log('⚡ isLoading:', isLoading);
    console.log('❌ queryError:', queryError);
  }, [categoryResponse, isLoading, queryError]);

  const categoriesWithAll = useMemo(() => {
    console.log('🔄 Calculating categoriesWithAll');
    console.log('📋 Raw categoryResponse:', categoryResponse);
    
    // FIX: Access the correct path - categoryResponse.data.messege
    if (!categoryResponse?.data?.messege) {
      console.log('⚠️ No messege in categoryResponse.data');
      return [];
    }
    
    // Fix: Handle the correct property name from your API
    // Your API returns 'categoryname' but your filter was looking for 'categouryname'
    const rawCategories = categoryResponse.data.messege; // Fixed path
    console.log('📝 Raw categories:', rawCategories);
    
    const filteredList = rawCategories.filter(cat => {
      const categoryName = cat.categoryname || cat.categouryname; // Handle both cases
      return categoryName?.toLowerCase() !== 'all';
    });
    
    console.log('🔍 Filtered categories (without All):', filteredList);
    
    const result = [
      { _id: '6834c7f5632a2871571413f7', categoryname: 'All' },
      ...filteredList,
    ];
    
    console.log('✅ Final categoriesWithAll:', result);
    return result;
  }, [categoryResponse]);

  const handleCategorySelect = useCallback((index) => {
    console.log('🎯 handleCategorySelect called with index:', index);
    console.log('🎯 Current selectedCategoryIndex:', selectedCategoryIndex);
    
    if (index === selectedCategoryIndex) {
      console.log('⚠️ Same category selected, skipping');
      return;
    }
    
    console.log('✅ Dispatching setSelectedCategory with index:', index);
    dispatch(setSelectedCategory(index));
  }, [selectedCategoryIndex, dispatch]);

  const renderItem = useCallback(({ item, index }) => {
    const categoryName = item.categoryname || item.categouryname; // Handle both cases
    const displayName = categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1);
    
    return (
      <TouchableOpacity
        style={[
          styles.item,
          selectedCategoryIndex === index && styles.selectedItem
        ]}
        onPress={() => handleCategorySelect(index)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.text, 
          selectedCategoryIndex === index && styles.selectedText
        ]}>
          {displayName}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedCategoryIndex, handleCategorySelect]);

  // Add debug logging for render states
  if (isLoading) {
    console.log('🔄 CategoryList rendering loading state');
    return (
      <View style={styles.container}>
        <Text>Loading categories...</Text>
      </View>
    );
  }

  if (queryError) {
    console.log('❌ CategoryList rendering error state:', queryError);
    return (
      <View style={styles.container}>
        <Text>Error: {queryError.message}</Text>
      </View>
    );
  }

  if (error) {
    console.log('❌ CategoryList rendering Redux error state:', error);
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  console.log('✅ CategoryList rendering with categories:', categoriesWithAll.length);
  
  return (
    <View style={styles.container}>
      <FlatList
        data={categoriesWithAll}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  list: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  selectedItem: {
    backgroundColor: '#1FFFA5',
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  selectedText: {
    color: '#fff',
  },
});