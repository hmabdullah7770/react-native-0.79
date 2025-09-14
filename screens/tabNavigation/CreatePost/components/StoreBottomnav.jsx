import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Keychain from 'react-native-keychain';
import * as yup from 'yup';

const urlSchema = yup.object().shape({
  url: yup.string().url('Please enter a valid URL').required('URL is required'),
});

const StoreBottomnav = ({visible, onClose, onApply, onRemove}) => {
  const [selectedMode, setSelectedMode] = useState('store'); // 'store' or 'url'
  const [placeholderEnabled, setPlaceholderEnabled] = useState(false);
  const [url, setUrl] = useState('');
  const [storeIdPresent, setStoreIdPresent] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    (async () => {
      try {
        const creds = await Keychain.getGenericPassword({service: 'storeId'});
        if (creds) {
          setStoreIdPresent(true);
          // default to store when storeId exists
          setSelectedMode('store');
          setPlaceholderEnabled(false);
        } else {
          setStoreIdPresent(false);
          // default to url when storeId missing
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
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const toggleMode = (mode) => {
    if (mode === 'store' && !storeIdPresent) {
      // User attempted to switch to store but there is no store id
      Alert.alert('No Store Found', 'You do not have a store in this app.');
      return;
    }

    setSelectedMode(mode);
    setPlaceholderEnabled(mode === 'url');
  };

  const handleApply = async () => {
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

    // selectedMode === 'store'
    if (!storeIdPresent) {
      Alert.alert('No Store Found', 'You do not have a store in this app.');
      return;
    }

    // Confirm applying store
    onApply({type: 'store', value: true});
    onClose();
  };

  const handleRemove = () => {
    onRemove && onRemove();
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.container, {transform: [{translateY: slideAnim}]}]}>
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
              onPress={() => toggleMode('store')}
            >
              <Text style={[styles.modeText, selectedMode === 'store' && styles.modeTextActive]}>Store</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeButton, selectedMode === 'url' && styles.modeButtonActive]}
              onPress={() => toggleMode('url')}
            >
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
            />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
              <Icon name="close" size={18} color="#ff4757" />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
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
  backdrop: {flex: 1},
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
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
});

export default StoreBottomnav;
