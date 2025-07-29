import React, { useMemo, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useCategoryNames } from '../../../ReactQuery/TanStackQueryHooks/useCategories';
import { setSelectedCategory } from '../../../Redux/action/categoury';

let renderCount = 0;

const CategoryList = () => {
  const prevHandleCategorySelect = useRef();
  const prevRenderItem = useRef();

  renderCount++;
  console.log(`CategoryList render count: ${renderCount}`);

  const dispatch = useDispatch();
  const { selectedCategoryIndex } = useSelector(state => state.category);

  // Use the new query structure
  const { data, isLoading, error } = useCategoryNames();
  const categories = data?.list || [];
  const total = data?.total || 0;

  // Memoize the categories with 'All' at the top
  const categoriesWithAll = useMemo(() => {
    if (!categories.length) return [];
    const filteredList = categories.filter(cat => cat.name?.toLowerCase() !== 'all');
    return [
      { id: '6834c7f5632a2871571413f7', name: 'All' },
      ...filteredList,
    ];
  }, [categories]);

  const handleCategorySelect = (index) => {
    if (index === selectedCategoryIndex) return;
    dispatch(setSelectedCategory(index));
  };

  const renderItem = ({ item, index }) => {
    const displayName = item.name?.charAt(0).toUpperCase() + item.name?.slice(1);
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
  };

  // Debug checks (optional)
  const wasRecreated = prevHandleCategorySelect.current !== handleCategorySelect;
  prevHandleCategorySelect.current = handleCategorySelect;
  const renderItemRecreated = prevRenderItem.current !== renderItem;
  prevRenderItem.current = renderItem;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categoriesWithAll}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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