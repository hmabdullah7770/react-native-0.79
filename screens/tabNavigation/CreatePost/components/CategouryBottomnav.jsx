import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CategouryBottomnav = ({visible, onClose, onApply, initialSelected, categories, isLoading, error}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Categories are now passed as props from parent component

  if (!visible) return null;

  const renderItem = ({item}) => {
    const isSelected = initialSelected?.id === item.id || initialSelected?.name === item.name;
    return (
      <TouchableOpacity
        style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
        onPress={() => onApply?.({id: item.id, name: item.name})}
      >
        <Icon name="category" size={18} color={isSelected ? '#fff' : '#FF9800'} />
        <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.container, {transform: [{translateY: slideAnim}]}]}>
        {/* Handle Bar */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Category</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isLoading && (
            <View style={styles.loadingState}>
              <ActivityIndicator color="#FF9800" />
              <Text style={styles.loadingText}>Loading categories…</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorState}>
              <Icon name="error-outline" size={20} color="#ff4757" />
              <Text style={styles.errorText}>Failed to load categories</Text>
            </View>
          )}

          {!isLoading && !error && (
            <FlatList
              data={categories}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 3000,
  },
  backdrop: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    minHeight: 200,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  list: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#ffe0b2',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  categoryText: {
    marginLeft: 8,
    color: '#333',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  errorState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorText: {
    marginLeft: 8,
    color: '#ff4757',
    fontWeight: '500',
  },
});

export default CategouryBottomnav;



