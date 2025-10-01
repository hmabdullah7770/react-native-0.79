import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Keychain from 'react-native-keychain';
import {useDispatch, useSelector} from 'react-redux';
import {getStoreProductRequest} from '../../../../Redux/action/storee/store_product';
import {useCreatePostContext} from '../context/CreatePostContext';
import ProductDropdown from './ProductDropdown';

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-.,@?^=%&:/~+#]*)?$/i;

const ProductBottomnav = ({visible, onClose, onApply, onRemove}) => {
  const [selectedMode, setSelectedMode] = useState('product');
  const [url, setUrl] = useState('');
  const [storeIdPresent, setStoreIdPresent] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const sheetHeight = useRef(Math.min(480, Math.round(windowHeight * 0.5))).current;
  const slideAnim = useRef(new Animated.Value(sheetHeight)).current;

  const dispatch = useDispatch();
  const {products, loading, error} = useSelector(state => state.storeproduct || {products: [], loading: false, error: null});

  useEffect(() => {
    (async () => {
      try {
        const creds = await Keychain.getGenericPassword({service: 'storeId'});
        if (creds) {
          setStoreIdPresent(true);
          setSelectedMode('product');
          if (visible) dispatch(getStoreProductRequest(creds.password || creds.username));
        } else {
          setStoreIdPresent(false);
          setSelectedMode('url');
        }
      } catch (err) {
        console.warn('Keychain read error', err);
        setStoreIdPresent(false);
        setSelectedMode('url');
      }
    })();
  }, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {toValue: 0, duration: 300, useNativeDriver: true}).start();
    } else {
      Animated.timing(slideAnim, {toValue: sheetHeight, duration: 300, useNativeDriver: true}).start();
    }
  }, [visible]);

  const toggleMode = (mode) => {
    if (mode === 'product' && !storeIdPresent) {
      Alert.alert('No Store Found', 'You do not have a store in this app.');
      return;
    }
    setSelectedMode(mode);
  };

  const handleApply = async () => {
    try {
      if (selectedMode === 'url') {
        if (!url || !urlRegex.test(url)) {
          Alert.alert('Validation Error', 'Please enter a valid URL');
          return;
        }
        
        if (onApply) {
          await onApply({type: 'url', value: url});
        }
        
        applySize('product', pendingSize);
        console.log('ProductBottomnav: Successfully applied URL with size:', pendingSize);
        
        onClose && onClose();
        return;
      }

      if (!products || products.length === 0) {
        Alert.alert('No items', 'No products available to select.');
        return;
      }
    } catch (error) {
      console.warn('Product apply operation failed:', error);
      Alert.alert('Error', 'Failed to apply product changes. Please try again.');
    }
  };

  const handleRemove = () => {
    try {
      clearApplied('product');
      const defaultSize = 'small';
      setPendingSize(defaultSize);
      console.log('ProductBottomnav: Removed product and reset to default size:', defaultSize);
      onRemove && onRemove();
      onClose && onClose();
    } catch (error) {
      console.warn('Error during product remove operation:', error);
      try {
        setPendingSize('small');
        onRemove && onRemove();
        onClose && onClose();
      } catch (fallbackError) {
        console.error('Critical error in handleRemove fallback:', fallbackError);
        onClose && onClose();
      }
    }
  };

  const onSelectProduct = async (product) => {
    try {
      if (onApply) {
        await onApply({type: 'product', value: product});
      }
      
      applySize('product', pendingSize);
      console.log('ProductBottomnav: Successfully applied product with size:', pendingSize);
      
      onClose && onClose();
    } catch (error) {
      console.warn('Product selection failed:', error);
      Alert.alert('Error', 'Failed to apply product selection. Please try again.');
    }
  };

  const {appliedLargeBy, getAppliedSizeFor, applySize, isLargeDisabled, isSmallDisabled, clearApplied, debugState} = useCreatePostContext();
  const [pendingSize, setPendingSize] = useState(getAppliedSizeFor('product'));
  const [largeDisabled, setLargeDisabled] = useState(isLargeDisabled('product'));
  const [smallDisabled, setSmallDisabled] = useState(isSmallDisabled('product'));
  
  useEffect(() => {
    const newLargeDisabled = isLargeDisabled('product');
    const newSmallDisabled = isSmallDisabled('product');
    setLargeDisabled(newLargeDisabled);
    setSmallDisabled(newSmallDisabled);
  }, [appliedLargeBy, isLargeDisabled, isSmallDisabled]);

  useEffect(() => {
    try {
      const effective = getAppliedSizeFor('product');
      setPendingSize(effective);
      debugState('PRODUCT_SYNC_PENDING', 'product', effective);
    } catch (error) {
      console.warn('Error syncing product pending size with context:', error);
      try {
        setPendingSize('small');
      } catch (fallbackError) {
        console.error('Critical error in product sync fallback:', fallbackError);
      }
    }
  }, [appliedLargeBy, getAppliedSizeFor, debugState]);

  useEffect(() => {
    if (visible) {
      try {
        const effective = getAppliedSizeFor('product');
        setPendingSize(effective);
        const newLargeDisabled = isLargeDisabled('product');
        const newSmallDisabled = isSmallDisabled('product');
        setLargeDisabled(newLargeDisabled);
        setSmallDisabled(newSmallDisabled);
        debugState('PRODUCT_OPENED', 'product', effective);
      } catch (error) {
        console.warn('Error initializing product component state:', error);
        try {
          setPendingSize('small');
          setLargeDisabled(false);
          setSmallDisabled(false);
        } catch (fallbackError) {
          console.error('Critical error in product initialization fallback:', fallbackError);
        }
      }
    }
  }, [visible, getAppliedSizeFor, debugState, appliedLargeBy, isLargeDisabled, isSmallDisabled]);

  const handleSizeChange = (size) => {
    try {
      if (size === 'large' && largeDisabled) {
        Alert.alert('Info', 'Store button is already large so you cannot select Large for Product.');
        return;
      }
      if (size === 'small' && smallDisabled) {
        Alert.alert('Info', 'Store button is already small so you cannot select Small for Product.');
        return;
      }
      setPendingSize(size);
    } catch (error) {
      console.warn('Error changing product size:', error);
      Alert.alert('Error', 'Failed to change button size. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <Animated.View style={[styles.container, {transform: [{translateY: slideAnim}]}]}>
          <SafeAreaView edges={["bottom"]}>
            <View style={styles.header}>
              <Text style={styles.title}>Add Product</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.body}>
              <View style={styles.switchRow}>
                <TouchableOpacity 
                  style={[styles.modeButton, selectedMode === 'product' && styles.modeButtonActive]} 
                  onPress={() => toggleMode('product')}
                  activeOpacity={0.7}>
                  <Text style={[styles.modeText, selectedMode === 'product' && styles.modeTextActive]}>Product</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modeButton, selectedMode === 'url' && styles.modeButtonActive]} 
                  onPress={() => toggleMode('url')}
                  activeOpacity={0.7}>
                  <Text style={[styles.modeText, selectedMode === 'url' && styles.modeTextActive]}>URL</Text>
                </TouchableOpacity>
              </View>

              {selectedMode === 'url' ? (
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.inputEnabled]}
                    placeholder={'Enter URL'}
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                    keyboardType="url"
                    contextMenuHidden={false}
                    returnKeyType="done"
                  />
                </View>
              ) : (
                <View style={styles.productListWrapper}>
                  <ProductDropdown
                    products={products}
                    loading={loading}
                    error={error}
                    isOpen={false}
                    onToggle={(open) => {}}
                    onProductSelect={onSelectProduct}
                  />
                </View>
              )}

              <View style={styles.sizeRow}>
                <Text style={{fontWeight: '600', marginBottom: 8}}>Button size</Text>
                <View style={{flexDirection: 'row', gap: 12}}>
                  <TouchableOpacity
                    style={[
                      styles.sizeButton,
                      pendingSize === 'large' && styles.sizeButtonActive,
                      largeDisabled && styles.sizeButtonDisabled
                    ]}
                    disabled={largeDisabled}
                    activeOpacity={0.7}
                    onPress={() => handleSizeChange('large')}>
                    <Text style={[
                      styles.sizeText, 
                      pendingSize === 'large' && styles.sizeTextActive,
                      largeDisabled && styles.sizeTextDisabled
                    ]}>Large</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.sizeButton, 
                      pendingSize === 'small' && styles.sizeButtonActive,
                      smallDisabled && styles.sizeButtonDisabled
                    ]}
                    disabled={smallDisabled}
                    activeOpacity={0.7}
                    onPress={() => handleSizeChange('small')}>
                    <Text style={[
                      styles.sizeText, 
                      pendingSize === 'small' && styles.sizeTextActive,
                      smallDisabled && styles.sizeTextDisabled
                    ]}>Small</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.removeBtn} onPress={handleRemove} activeOpacity={0.7}>
                  <Icon name="close" size={18} color="#ff4757" />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyBtn} onPress={async () => {
                  try {
                    debugState('PRODUCT_BEFORE_APPLY', 'product', pendingSize);
                    await handleApply();
                    debugState('PRODUCT_AFTER_APPLY', 'product', pendingSize);
                  } catch (error) {
                    console.warn('Apply button error:', error);
                  }
                }} activeOpacity={0.7}>
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000},
  backdrop: {flex: 1},
  keyboardAvoid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, elevation: 20},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  title: {fontSize: 18, fontWeight: '600', color: '#333'},
  closeButton: {padding: 4},
  body: {marginTop: 12},
  switchRow: {flexDirection: 'row', marginBottom: 12, gap: 12},
  modeButton: {flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#f2f2f2', alignItems: 'center'},
  modeButtonActive: {backgroundColor: '#2196F3'},
  modeText: {color: '#333', fontWeight: '500'},
  modeTextActive: {color: '#fff'},
  inputRow: {marginVertical: 12},
  input: {borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12},
  inputEnabled: {backgroundColor: '#fff'},
  actionsRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 12},
  removeBtn: {flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff5f5', borderRadius: 8, borderWidth: 1, borderColor: '#ffebee'},
  removeText: {marginLeft: 8, color: '#ff4757'},
  applyBtn: {padding: 12, backgroundColor: '#2196F3', borderRadius: 8, alignItems: 'center', justifyContent: 'center'},
  applyText: {color: '#fff', fontWeight: '600'},
  productListWrapper: {maxHeight: 260},
  sizeRow: {marginTop: 12, marginBottom: 6},
  sizeButton: {paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f2f2f2', alignItems: 'center'},
  sizeButtonActive: {backgroundColor: '#2196F3'},
  sizeButtonDisabled: {opacity: 0.45},
  sizeText: {color: '#333', fontWeight: '500'},
  sizeTextActive: {color: '#fff'},
  sizeTextDisabled: {color: '#999'},
});

export default ProductBottomnav;