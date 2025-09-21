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

  const handleApply = () => {
    if (selectedMode === 'url') {
      if (!url || !urlRegex.test(url)) {
        Alert.alert('Validation Error', 'Please enter a valid URL');
        return;
      }
      onApply && onApply({type: 'url', value: url});
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
  };

  const handleRemove = () => {
    onRemove && onRemove();
    onClose && onClose();
  };

  const onSelectProduct = (product) => {
    onApply && onApply({type: 'product', value: product});
    onClose && onClose();
  };

  // button size controls: use pending local selection until user hits Apply
  const {getAppliedSizeFor, applySize, isLargeDisabled} = useCreatePostContext();
  const [pendingSize, setPendingSize] = useState(getAppliedSizeFor('product'));
  const largeDisabled = isLargeDisabled('product');

  const handleSizeChange = (size) => {
    setPendingSize(size);
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
                  style={[styles.sizeButton, pendingSize === 'large' && styles.sizeButtonActive, largeDisabled && styles.sizeButtonDisabled]}
                  onPress={() => {
                    if (largeDisabled && pendingSize !== 'large') {
                      Alert.alert('Info', 'Store button is already large so you cannot select Large for Product.');
                      return;
                    }
                    handleSizeChange('large');
                  }}
                >
                  <Text style={[styles.sizeText, pendingSize === 'large' && styles.sizeTextActive]}>Large</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sizeButton, pendingSize === 'small' && styles.sizeButtonActive]}
                  onPress={() => handleSizeChange('small')}
                >
                  <Text style={[styles.sizeText, pendingSize === 'small' && styles.sizeTextActive]}>Small</Text>
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
                  applySize('product', pendingSize);
                  handleApply();
                } catch (e) {
                  console.warn('Apply size error', e);
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
});

export default ProductBottomnav;
