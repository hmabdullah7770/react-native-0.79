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
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Keychain from 'react-native-keychain';
import {useDispatch, useSelector} from 'react-redux';
import {getStoreProductRequest} from '../../../../Redux/action/storee/store_product';
import {useCreatePostContext} from '../context/CreatePostContext';
import ProductDropdown from './ProductDropdown';

let KeyboardController;
try {
  // eslint-disable-next-line global-require
  KeyboardController = require('react-native-keyboard-controller').default;
} catch (e) {
  KeyboardController = null;
}

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-.,@?^=%&:/~+#]*)?$/i;

const ProductBottomnav = ({visible, onClose, onApply, onRemove}) => {
  const [selectedMode, setSelectedMode] = useState('product'); // 'product' or 'url'
  const [url, setUrl] = useState('');
  const [storeIdPresent, setStoreIdPresent] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const sheetHeight = useRef(Math.min(480, Math.round(windowHeight * 0.5))).current;
  const slideAnim = useRef(new Animated.Value(sheetHeight)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const {products, loading, error} = useSelector(state => state.storeproduct || {products: [], loading: false, error: null});

  useEffect(() => {
    (async () => {
      try {
        const creds = await Keychain.getGenericPassword({service: 'storeId'});
        if (creds) {
          setStoreIdPresent(true);
          setSelectedMode('product');
          // fetch products
          // Fetch once when sheet becomes visible and storeId exists
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

  // Keyboard handling to lift sheet above keyboard
  useEffect(() => {
    if (!visible) return;
    let subs = [];
    if (KeyboardController) {
      const onShow = ({height}) => {
        Animated.timing(keyboardOffset, {toValue: height + 8, duration: 250, useNativeDriver: true}).start();
      };
      const onHide = () => {
        Animated.timing(keyboardOffset, {toValue: 0, duration: 200, useNativeDriver: true}).start();
      };
      KeyboardController.on('keyboardWillShow', onShow);
      KeyboardController.on('keyboardWillHide', onHide);
      subs.push(() => KeyboardController.off('keyboardWillShow', onShow));
      subs.push(() => KeyboardController.off('keyboardWillHide', onHide));
    } else {
      const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e) => {
        const h = e.endCoordinates ? e.endCoordinates.height : 300;
        Animated.timing(keyboardOffset, {toValue: h + 8, duration: 250, useNativeDriver: true}).start();
      });
      const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
        Animated.timing(keyboardOffset, {toValue: 0, duration: 200, useNativeDriver: true}).start();
      });
      subs.push(() => showSub.remove());
      subs.push(() => hideSub.remove());
    }

    return () => subs.forEach((s) => s());
  }, [visible, keyboardOffset]);

  const toggleMode = (mode) => {
    if (mode === 'product' && !storeIdPresent) {
      Alert.alert('No Store Found', 'You do not have a store in this app.');
      return;
    }
    setSelectedMode(mode);
    // when switching to product mode we rely on previously fetched products
  };

  const handleApply = async () => {
    try {
      if (selectedMode === 'url') {
        if (!url || !urlRegex.test(url)) {
          Alert.alert('Validation Error', 'Please enter a valid URL');
          return;
        }
        
        // First call the parent apply handler - this may throw if it fails
        if (onApply) {
          await onApply({type: 'url', value: url});
        }
        
        // Only update context if parent apply succeeded
        applySize('product', pendingSize);
        console.log('ProductBottomnav: Successfully applied URL with size:', pendingSize);
        
        // Close the bottom sheet
        onClose && onClose();
        return;
      }

      // product mode
      // product selection will be handled via a tap on a product item
      // if no products, show message
      if (!products || products.length === 0) {
        Alert.alert('No items', 'No products available to select.');
        return;
      }
      // No direct synchronous apply here; product selection triggers onSelectProduct
    } catch (error) {
      console.warn('Product apply operation failed:', error);
      Alert.alert('Error', 'Failed to apply product changes. Please try again.');
      // Don't update context or close on failure
    }
  };

  const handleRemove = () => {
    try {
      // Clear context constraint first
      clearApplied('product');
      
      // Reset local state to default (product default is 'small')
      const defaultSize = 'small';
      setPendingSize(defaultSize);
      
      console.log('ProductBottomnav: Removed product and reset to default size:', defaultSize);
      
      // Notify parent components
      onRemove && onRemove();
      onClose && onClose();
    } catch (error) {
      console.warn('Error during product remove operation:', error);
      // Still proceed with removal to avoid stuck state
      try {
        setPendingSize('small'); // Force reset to default
        onRemove && onRemove();
        onClose && onClose();
      } catch (fallbackError) {
        console.error('Critical error in handleRemove fallback:', fallbackError);
        // Still try to close to avoid completely stuck state
        onClose && onClose();
      }
    }
  };

  const onSelectProduct = async (product) => {
    try {
      // First call the parent apply handler - this may throw if it fails
      if (onApply) {
        await onApply({type: 'product', value: product});
      }
      
      // Only update context if parent apply succeeded
      applySize('product', pendingSize);
      console.log('ProductBottomnav: Successfully applied product with size:', pendingSize);
      
      // Close the bottom sheet
      onClose && onClose();
    } catch (error) {
      console.warn('Product selection failed:', error);
      Alert.alert('Error', 'Failed to apply product selection. Please try again.');
      // Don't update context or close on failure
    }
  };

  // button size controls: use pending local selection until user hits Apply
  const {appliedLargeBy, getAppliedSizeFor, applySize, isLargeDisabled, isSmallDisabled, clearApplied, debugState} = useCreatePostContext();
  const [pendingSize, setPendingSize] = useState(getAppliedSizeFor('product'));
  
  // Make disabled states reactive to context changes
  const [largeDisabled, setLargeDisabled] = useState(isLargeDisabled('product'));
  const [smallDisabled, setSmallDisabled] = useState(isSmallDisabled('product'));
  
  // Update disabled states when context changes
  useEffect(() => {
    const newLargeDisabled = isLargeDisabled('product');
    const newSmallDisabled = isSmallDisabled('product');
    console.log(`ProductBottomnav: Updating disabled states - Large: ${newLargeDisabled}, Small: ${newSmallDisabled}, appliedLargeBy: ${appliedLargeBy}`);
    setLargeDisabled(newLargeDisabled);
    setSmallDisabled(newSmallDisabled);
  }, [appliedLargeBy, isLargeDisabled, isSmallDisabled]);

  // Keep pendingSize in-sync with context when appliedLargeBy changes or other component removes
  useEffect(() => {
    try {
      const effective = getAppliedSizeFor('product');
      setPendingSize(effective);
      debugState('PRODUCT_SYNC_PENDING', 'product', effective);
      console.log('ProductBottomnav: Synced pendingSize to:', effective, 'due to appliedLargeBy:', appliedLargeBy);
    } catch (error) {
      console.warn('Error syncing product pending size with context:', error);
      // Fallback to default on error to prevent stuck state
      try {
        setPendingSize('small');
        console.log('ProductBottomnav: Fallback to default size due to sync error');
      } catch (fallbackError) {
        console.error('Critical error in product sync fallback:', fallbackError);
      }
    }
  }, [appliedLargeBy, getAppliedSizeFor, debugState]);

  // Initialize pendingSize and disabled states when component mounts or becomes visible
  useEffect(() => {
    if (visible) {
      try {
        const effective = getAppliedSizeFor('product');
        setPendingSize(effective);
        
        // Also update disabled states when component becomes visible
        const newLargeDisabled = isLargeDisabled('product');
        const newSmallDisabled = isSmallDisabled('product');
        console.log(`ProductBottomnav: Initializing on open - Size: ${effective}, Large disabled: ${newLargeDisabled}, Small disabled: ${newSmallDisabled}, appliedLargeBy: ${appliedLargeBy}`);
        setLargeDisabled(newLargeDisabled);
        setSmallDisabled(newSmallDisabled);
        
        debugState('PRODUCT_OPENED', 'product', effective);
      } catch (error) {
        console.warn('Error initializing product component state:', error);
        // Fallback to defaults on error
        try {
          setPendingSize('small');
          setLargeDisabled(false);
          setSmallDisabled(false);
          console.log('ProductBottomnav: Fallback to default state due to initialization error');
        } catch (fallbackError) {
          console.error('Critical error in product initialization fallback:', fallbackError);
        }
      }
    }
  }, [visible, getAppliedSizeFor, debugState, appliedLargeBy, isLargeDisabled, isSmallDisabled]);

  const handleSizeChange = (size) => {
    try {
      if (size === 'large' && largeDisabled) {
        // user tried to select a disabled large; show info and ignore
        Alert.alert('Info', 'Store button is already large so you cannot select Large for Product.');
        return;
      }
      if (size === 'small' && smallDisabled) {
        // user tried to select a disabled small; show info and ignore
        Alert.alert('Info', 'Store button is already small so you cannot select Small for Product.');
        return;
      }
      
      // allow changing pending size freely; the applied lock only sets on Apply
      setPendingSize(size);
      console.log('ProductBottomnav: Changed pending size to:', size);
    } catch (error) {
      console.warn('Error changing product size:', error);
      Alert.alert('Error', 'Failed to change button size. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
  <Animated.View style={[styles.container, {transform: [{translateY: slideAnim}, {translateY: keyboardOffset.interpolate({inputRange: [0, 1000], outputRange: [0, -1], extrapolate: 'clamp'})}], bottom: 16, maxHeight: sheetHeight + 16}] }>
        <SafeAreaView edges={["bottom"]}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Product</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.switchRow}>
              <TouchableOpacity style={[styles.modeButton, selectedMode === 'product' && styles.modeButtonActive]} onPress={() => toggleMode('product')}>
                <Text style={[styles.modeText, selectedMode === 'product' && styles.modeTextActive]}>Product</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeButton, selectedMode === 'url' && styles.modeButtonActive]} onPress={() => toggleMode('url')}>
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
                />
              </View>
            ) : (
              <View style={styles.productListWrapper}>
                {/* Presentational dropdown component receives products/loading/error and control props */}
                <ProductDropdown
                  products={products}
                  loading={loading}
                  error={error}
                  isOpen={false}
                  onToggle={(open) => {
                    // control toggle: when opening, nothing special required because products are already fetched
                    // This local implementation will manage a simple open state per sheet instance.
                    // For now, ProductDropdown will receive false as default and ProductBottomnav will control via re-render if needed.
                  }}
                  onProductSelect={onSelectProduct}
                />
               
              
                {/* Also show inline list as fallback for accessibility (keeps old behaviour without duplicates) */}
                {/* {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" />
                  </View>
                ) : error ? (
                  <View style={styles.errorContainer}><Text style={styles.errorText}>Error loading products</Text></View>
                ) : products && products.length > 0 ? (
                  <ScrollView style={styles.productScroll} nestedScrollEnabled={true}>
                    {products.map((p) => (
                      <TouchableOpacity key={p._id} style={styles.productItem} onPress={() => onSelectProduct(p)}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image source={{uri: p.productImages && p.productImages.length > 0 ? p.productImages[0] : 'https://via.placeholder.com/40'}} style={{width:40,height:40,borderRadius:6,marginRight:12}} />
                          <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>{p.productName}</Text>
                            <Text style={styles.productPrice}>${p.finalPrice || p.productPrice}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.noItemsContainer}><Text style={styles.noItemsText}>No items found</Text></View>
                )} */}
              </View>
            )}

            {/* Button size toggle */}
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
                  onPress={() => {
                    if (largeDisabled) {
                      Alert.alert('Info', 'Store button is already large so you cannot select Large for Product.');
                      return;
                    }
                    handleSizeChange('large');
                  }}
                >
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
                  onPress={() => handleSizeChange('small')}
                >
                  <Text style={[
                    styles.sizeText, 
                    pendingSize === 'small' && styles.sizeTextActive,
                    smallDisabled && styles.sizeTextDisabled
                  ]}>Small</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
                <Icon name="close" size={18} color="#ff4757" />
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyBtn} onPress={async () => {
                try {
                  // Debug before apply
                  debugState('PRODUCT_BEFORE_APPLY', 'product', pendingSize);
                  
                  // Use the handleApply function which now handles context updates properly
                  await handleApply();
                  
                  debugState('PRODUCT_AFTER_APPLY', 'product', pendingSize);
                } catch (error) {
                  console.warn('Apply button error:', error);
                  // Error handling is already done in handleApply
                }
              }}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000},
  backdrop: {flex: 1},
  container: {position: 'absolute', left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16},
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
  productScroll: {maxHeight: 240},
  productItem: {flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  productInfo: {flex: 1},
  productName: {fontSize: 16, fontWeight: '500', color: '#333'},
  productPrice: {fontSize: 14, color: '#007AFF', fontWeight: '600'},
  noItemsContainer: {padding: 20, alignItems: 'center'},
  noItemsText: {fontSize: 14, color: '#666'},
  loadingContainer: {padding: 20, alignItems: 'center'},
  errorContainer: {padding: 20, alignItems: 'center'},
  errorText: {color: '#ff4444'},
  sizeRow: {marginTop: 12, marginBottom: 6},
  sizeButton: {paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f2f2f2', alignItems: 'center'},
  sizeButtonActive: {backgroundColor: '#2196F3'},
  sizeButtonDisabled: {opacity: 0.45},
  sizeText: {color: '#333', fontWeight: '500'},
  sizeTextActive: {color: '#fff'},
  sizeTextDisabled: {color: '#999'},
});

export default ProductBottomnav;
