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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Keychain from 'react-native-keychain';
import {useCreatePostContext} from '../context/CreatePostContext';
import * as yup from 'yup';

const urlSchema = yup.object().shape({
  url: yup.string().url('Please enter a valid URL').required('URL is required'),
});

const StoreBottomnav = ({visible, onClose, onApply, onRemove}) => {
  const [selectedMode, setSelectedMode] = useState('store');
  const [placeholderEnabled, setPlaceholderEnabled] = useState(false);
  const [url, setUrl] = useState('');
  const [storeIdPresent, setStoreIdPresent] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const sheetHeight = useRef(Math.min(420, Math.round(windowHeight * 0.45))).current;
  const slideAnim = useRef(new Animated.Value(sheetHeight)).current;

  useEffect(() => {
    (async () => {
      try {
        const creds = await Keychain.getGenericPassword({service: 'storeId'});
        if (creds) {
          setStoreIdPresent(true);
          setSelectedMode('store');
          setPlaceholderEnabled(false);
        } else {
          setStoreIdPresent(false);
          setSelectedMode('url');
          setPlaceholderEnabled(true);
        }
      } catch (err) {
        console.warn('Error reading storeId from Keychain', err);
        setStoreIdPresent(false);
        setSelectedMode('url');
        setPlaceholderEnabled(true);
      }
    })();
  }, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: sheetHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const toggleMode = (mode) => {
    if (mode === 'store' && !storeIdPresent) {
      Alert.alert('No Store Found', 'You do not have a store in this app.');
      return;
    }
    setSelectedMode(mode);
    setPlaceholderEnabled(mode === 'url');
  };

  const handleApply = async () => {
    try {
      if (selectedMode === 'url') {
        try {
          await urlSchema.validate({url});
          onApply({type: 'url', value: url});
          onClose();
        } catch (err) {
          Alert.alert('Validation Error', err.message);
        }
        return;
      }

      if (!storeIdPresent) {
        Alert.alert('No Store Found', 'You do not have a store in this app.');
        return;
      }

      if (onApply) {
        await onApply({type: 'store', value: true});
      }
      
      applySize('store', pendingSize);
      console.log('StoreBottomnav: Successfully applied store with size:', pendingSize);
      
      onClose && onClose();
    } catch (error) {
      console.warn('Store apply operation failed:', error);
      Alert.alert('Error', 'Failed to apply store changes. Please try again.');
    }
  };

  const handleRemove = () => {
    try {
      clearApplied('store');
      const defaultSize = 'large';
      setPendingSize(defaultSize);
      console.log('StoreBottomnav: Removed store and reset to default size:', defaultSize);
      onRemove && onRemove();
      onClose && onClose();
    } catch (error) {
      console.warn('Error during store remove operation:', error);
      try {
        setPendingSize('large');
        onRemove && onRemove();
        onClose && onClose();
      } catch (fallbackError) {
        console.error('Critical error in handleRemove fallback:', fallbackError);
        onClose && onClose();
      }
    }
  };

  const {appliedLargeBy, getAppliedSizeFor, applySize, isLargeDisabled, isSmallDisabled, clearApplied, debugState} = useCreatePostContext();
  const [pendingSize, setPendingSize] = useState(getAppliedSizeFor('store'));
  const [largeDisabled, setLargeDisabled] = useState(isLargeDisabled('store'));
  const [smallDisabled, setSmallDisabled] = useState(isSmallDisabled('store'));
  
  useEffect(() => {
    const newLargeDisabled = isLargeDisabled('store');
    const newSmallDisabled = isSmallDisabled('store');
    setLargeDisabled(newLargeDisabled);
    setSmallDisabled(newSmallDisabled);
  }, [appliedLargeBy, isLargeDisabled, isSmallDisabled]);

  useEffect(() => {
    try {
      const effective = getAppliedSizeFor('store');
      setPendingSize(effective);
      debugState('STORE_SYNC_PENDING', 'store', effective);
    } catch (error) {
      console.warn('Error syncing store pending size with context:', error);
      try {
        setPendingSize('large');
      } catch (fallbackError) {
        console.error('Critical error in store sync fallback:', fallbackError);
      }
    }
  }, [appliedLargeBy, getAppliedSizeFor, debugState]);

  useEffect(() => {
    if (visible) {
      try {
        const effective = getAppliedSizeFor('store');
        setPendingSize(effective);
        const newLargeDisabled = isLargeDisabled('store');
        const newSmallDisabled = isSmallDisabled('store');
        setLargeDisabled(newLargeDisabled);
        setSmallDisabled(newSmallDisabled);
        debugState('STORE_OPENED', 'store', effective);
      } catch (error) {
        console.warn('Error initializing store component state:', error);
        try {
          setPendingSize('large');
          setLargeDisabled(false);
          setSmallDisabled(false);
        } catch (fallbackError) {
          console.error('Critical error in store initialization fallback:', fallbackError);
        }
      }
    }
  }, [visible, getAppliedSizeFor, debugState, appliedLargeBy, isLargeDisabled, isSmallDisabled]);

  const handleSizeChange = (size) => {
    try {
      if (size === 'large' && largeDisabled) {
        Alert.alert('Info', 'Product button is already large so you cannot select Large for Store.');
        return;
      }
      if (size === 'small' && smallDisabled) {
        Alert.alert('Info', 'Product button is already small so you cannot select Small for Store.');
        return;
      }
      setPendingSize(size);
    } catch (error) {
      console.warn('Error changing store size:', error);
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
        <Animated.View
          style={[
            styles.container,
            {transform: [{translateY: slideAnim}]},
          ]}>
          <SafeAreaView edges={["bottom"]}>
            <View style={styles.header}>
              <Text style={styles.title}>Add Store</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.body}>
              <View style={styles.switchRow}>
                <TouchableOpacity
                  style={[styles.modeButton, selectedMode === 'store' && styles.modeButtonActive]}
                  onPress={() => toggleMode('store')}>
                  <Text style={[styles.modeText, selectedMode === 'store' && styles.modeTextActive]}>Store</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modeButton, selectedMode === 'url' && styles.modeButtonActive]}
                  onPress={() => toggleMode('url')}>
                  <Text style={[styles.modeText, selectedMode === 'url' && styles.modeTextActive]}>URL</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, placeholderEnabled ? styles.inputEnabled : styles.inputDisabled]}
                  placeholder={selectedMode === 'url' ? 'Enter URL' : 'Store selection (disabled)'}
                  editable={placeholderEnabled}
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                  contextMenuHidden={false}
                  returnKeyType="done"
                />
              </View>

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
                <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
                  <Icon name="close" size={18} color="#ff4757" />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyBtn} onPress={async () => {
                  try {
                    debugState('STORE_BEFORE_APPLY', 'store', pendingSize);
                    await handleApply();
                    debugState('STORE_AFTER_APPLY', 'store', pendingSize);
                  } catch (error) {
                    console.warn('Apply button error:', error);
                  }
                }}>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 3000,
  },
  backdrop: {flex: 1},
  keyboardAvoid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    elevation: 20,
  },
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
  inputDisabled: {backgroundColor: '#f5f5f5', color: '#999'},
  inputEnabled: {backgroundColor: '#fff'},
  actionsRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 12},
  removeBtn: {flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff5f5', borderRadius: 8, borderWidth: 1, borderColor: '#ffebee'},
  removeText: {marginLeft: 8, color: '#ff4757'},
  applyBtn: {padding: 12, backgroundColor: '#2196F3', borderRadius: 8, alignItems: 'center', justifyContent: 'center'},
  applyText: {color: '#fff', fontWeight: '600'},
  sizeRow: {marginTop: 12, marginBottom: 6},
  sizeButton: {paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f2f2f2', alignItems: 'center'},
  sizeButtonActive: {backgroundColor: '#2196F3'},
  sizeButtonDisabled: {opacity: 0.45},
  sizeText: {color: '#333', fontWeight: '500'},
  sizeTextActive: {color: '#fff'},
  sizeTextDisabled: {color: '#999'},
});

export default StoreBottomnav;