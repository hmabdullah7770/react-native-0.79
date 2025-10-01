import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MediaBottomnav = ({visible, onClose, onApply, initialData = null}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  const [socialMediaData, setSocialMediaData] = useState({
    facebook: {
      enabled: false,
      link: '',
      asyncValue: '',
      hasAsyncValue: false,
      icon: 'facebook',
      iconColor: '#1877F2',
      placeholder: 'Enter Facebook link',
      title: 'Facebook',
      description: 'Link your Facebook page',
    },
    instagram: {
      enabled: false,
      link: '',
      asyncValue: '',
      hasAsyncValue: false,
      icon: 'camera-alt',
      iconColor: '#E4405F',
      placeholder: 'Enter Instagram link',
      title: 'Instagram',
      description: 'Link your Instagram profile',
    },
    whatsapp: {
      enabled: false,
      number: '',
      asyncValue: '',
      hasAsyncValue: false,
      icon: 'chat',
      iconColor: '#25D366',
      placeholder: 'Enter WhatsApp number',
      title: 'WhatsApp',
      description: 'Connect your WhatsApp',
    },
    storeLink: {
      enabled: false,
      url: '',
      asyncValue: '',
      hasAsyncValue: false,
      icon: 'store',
      iconColor: '#666',
      placeholder: 'Enter store link',
      title: 'Store Link',
      description: 'Add your online store URL',
    },
  });

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

  // Load data from AsyncStorage on component mount
  useEffect(() => {
    const loadAsyncStorageData = async () => {
      try {
        const facebookUrl = await AsyncStorage.getItem('facebookId');
        const instagramUrl = await AsyncStorage.getItem('instagramId');
        const whatsappNumber = await AsyncStorage.getItem('whatsappId');
        const storeUrl = await AsyncStorage.getItem('storeLinkUrl');

        console.log('AsyncStorage values loaded:', {
          facebookUrl,
          instagramUrl,
          whatsappNumber,
          storeUrl,
        });

        setSocialMediaData(prev => ({
          ...prev,
          facebook: {
            ...prev.facebook,
            asyncValue: facebookUrl || '',
            hasAsyncValue: !!facebookUrl,
            enabled: false,
          },
          instagram: {
            ...prev.instagram,
            asyncValue: instagramUrl || '',
            hasAsyncValue: !!instagramUrl,
            enabled: false,
          },
          whatsapp: {
            ...prev.whatsapp,
            asyncValue: whatsappNumber || '',
            hasAsyncValue: !!whatsappNumber,
            enabled: false,
          },
          storeLink: {
            ...prev.storeLink,
            asyncValue: storeUrl || '',
            hasAsyncValue: !!storeUrl,
            enabled: false,
          },
        }));
      } catch (error) {
        console.warn('Error loading AsyncStorage data:', error);
      }
    };

    if (visible) {
      loadAsyncStorageData();
    }
  }, [visible]);

  // Initialize with existing data if provided
  useEffect(() => {
    if (initialData) {
      setSocialMediaData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // ✅ FIX: respect "newValue" from Switch
  const togglePlatform = (platform, newValue) => {
    setSocialMediaData(prev => {
      const platformData = prev[platform];

      // If enabling but no AsyncStorage value, block it
      if (newValue && !platformData.hasAsyncValue) {
        Alert.alert(
          'Account Not Linked',
          `You don't have your ${platformData.title} attached to this account. Please link it in your profile settings first.`,
          [{text: 'OK', style: 'default'}],
        );
        return prev; // do not change state
      }

      // Otherwise update normally
      return {
        ...prev,
        [platform]: {
          ...prev[platform],
          enabled: newValue,
        },
      };
    });
  };

  const updatePlatformValue = (platform, field, value) => {
    setSocialMediaData(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const renderPlatformRow = (platformKey, platformData) => {
    const inputField =
      platformKey === 'whatsapp'
        ? 'number'
        : platformKey === 'storeLink'
        ? 'url'
        : 'link';

    return (
      <View key={platformKey} style={styles.platformContainer}>
        <View style={styles.platformHeader}>
          <View style={styles.platformInfo}>
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: `${platformData.iconColor}15`},
              ]}>
              <Icon
                name={platformData.icon}
                size={24}
                color={platformData.iconColor}
              />
            </View>
            <View style={styles.platformText}>
              <Text style={styles.platformTitle}>{platformData.title}</Text>
              {platformData.hasAsyncValue && (
                <Text style={styles.asyncValueText}>
                  {platformData.asyncValue.length > 30
                    ? `${platformData.asyncValue.substring(0, 30)}...`
                    : platformData.asyncValue}
                </Text>
              )}
            </View>
          </View>
          <Switch
            value={platformData.enabled}
            onValueChange={value => togglePlatform(platformKey, value)} // ✅ fixed
            disabled={false}
            trackColor={{
              false: '#e0e0e0',
              true: `${platformData.iconColor}30`,
            }}
            thumbColor={
              platformData.enabled ? platformData.iconColor : '#f4f3f4'
            }
          />
        </View>

        {/* Input field (disabled when switch is ON) */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              platformData.enabled && styles.disabledInput,
            ]}
            placeholder={platformData.placeholder}
            value={
              platformData.enabled
                ? platformData.asyncValue
                : platformData[inputField]
            }
            onChangeText={value =>
              updatePlatformValue(platformKey, inputField, value)
            }
            placeholderTextColor="#999"
            keyboardType={platformKey === 'whatsapp' ? 'phone-pad' : 'default'}
            autoCapitalize="none"
            editable={!platformData.enabled}
          />
        </View>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[styles.container, {transform: [{translateY: slideAnim}]}]}>
        <View style={styles.handleBar} />

        <View style={styles.header}>
          <Text style={styles.title}>Link Social Media</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {Object.entries(socialMediaData).map(([key, data]) =>
            renderPlatformRow(key, data),
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onApply(socialMediaData);
              onClose();
            }}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
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
    minHeight: 320,
    elevation: 20,
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
    paddingBottom: 16,
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
    padding: 12,
    paddingBottom: 4,
  },
  platformContainer: {
    marginBottom: 8,
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  platformText: {
    flex: 1,
  },
  platformTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  asyncValueText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    marginTop: 4,
    paddingHorizontal: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MediaBottomnav;




// import React, {useState, useRef, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   TextInput,
//   Switch,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const MediaBottomnav = ({visible, onClose, onApply, initialData = null}) => {
//   const slideAnim = useRef(new Animated.Value(300)).current;

//   const [socialMediaData, setSocialMediaData] = useState({
//     facebook: {
//       enabled: false,
//       link: '',
//       asyncValue: '',
//       hasAsyncValue: false,
//       icon: 'facebook',
//       iconColor: '#1877F2',
//       placeholder: 'Enter Facebook link',
//       title: 'Facebook',
//       description: 'Link your Facebook page',
//     },
//     instagram: {
//       enabled: false,
//       link: '',
//       asyncValue: '',
//       hasAsyncValue: false,
//       icon: 'camera-alt',
//       iconColor: '#E4405F',
//       placeholder: 'Enter Instagram link',
//       title: 'Instagram',
//       description: 'Link your Instagram profile',
//     },
//     whatsapp: {
//       enabled: false,
//       number: '',
//       asyncValue: '',
//       hasAsyncValue: false,
//       icon: 'chat',
//       iconColor: '#25D366',
//       placeholder: 'Enter WhatsApp number',
//       title: 'WhatsApp',
//       description: 'Connect your WhatsApp',
//     },
//     storeLink: {
//       enabled: false,
//       url: '',
//       asyncValue: '',
//       hasAsyncValue: false,
//       icon: 'store',
//       iconColor: '#666',
//       placeholder: 'Enter store link',
//       title: 'Store Link',
//       description: 'Add your online store URL',
//     },
//   });

//   useEffect(() => {
//     if (visible) {
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: 300,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible]);

//   // Load data from AsyncStorage on component mount
//   useEffect(() => {
//     const loadAsyncStorageData = async () => {
//       try {
//         const facebookUrl = await AsyncStorage.getItem('facebookId');
//         const instagramUrl = await AsyncStorage.getItem('instagramId');
//         const whatsappNumber = await AsyncStorage.getItem('whatsappId');
//         const storeUrl = await AsyncStorage.getItem('storeLinkUrl');

//         console.log('AsyncStorage values loaded:');
//         console.log('Facebook:', facebookUrl, '- hasValue:', !!facebookUrl);
//         console.log('Instagram:', instagramUrl, '- hasValue:', !!instagramUrl);
//         console.log(
//           'WhatsApp:',
//           whatsappNumber,
//           '- hasValue:',
//           !!whatsappNumber,
//         );
//         console.log('Store Link:', storeUrl, '- hasValue:', !!storeUrl);

//         setSocialMediaData(prev => ({
//           ...prev,
//           facebook: {
//             ...prev.facebook,
//             asyncValue: facebookUrl || '',
//             hasAsyncValue: !!facebookUrl,
//             enabled: false, // Always start disabled
//           },
//           instagram: {
//             ...prev.instagram,
//             asyncValue: instagramUrl || '',
//             hasAsyncValue: !!instagramUrl,
//             enabled: false,
//           },
//           whatsapp: {
//             ...prev.whatsapp,
//             asyncValue: whatsappNumber || '',
//             hasAsyncValue: !!whatsappNumber,
//             enabled: false,
//           },
//           storeLink: {
//             ...prev.storeLink,
//             asyncValue: storeUrl || '',
//             hasAsyncValue: !!storeUrl,
//             enabled: false,
//           },
//         }));
//       } catch (error) {
//         console.warn('Error loading AsyncStorage data:', error);
//       }
//     };

//     if (visible) {
//       loadAsyncStorageData();
//     }
//   }, [visible]);

//   // Initialize with existing data if provided
//   useEffect(() => {
//     if (initialData) {
//       setSocialMediaData(prev => ({
//         ...prev,
//         ...initialData,
//       }));
//     }
//   }, [initialData]);

//   const togglePlatform = platform => {
//     console.log(`Switch pressed for: ${platform}`);

//     setSocialMediaData(prev => {
//       const platformData = prev[platform];
//       console.log(`Platform data for ${platform}:`, platformData);

//       // If trying to enable but no AsyncStorage value, show alert
//       if (!platformData.enabled && !platformData.hasAsyncValue) {
//         console.log(`No AsyncStorage value for ${platform}, showing alert`);

//         // Show alert immediately without setTimeout
//         Alert.alert(
//           'Account Not Linked',
//           `You don't have your ${platformData.title} attached to this account. Please link it in your profile settings first.`,
//           [{text: 'OK', style: 'default'}],
//         );

//         return prev; // Don't change state
//       }

//       // Toggle the switch state
//       const newEnabled = !platformData.enabled;
//       console.log(
//         `Toggling ${platform} from ${platformData.enabled} to ${newEnabled}`,
//       );

//       return {
//         ...prev,
//         [platform]: {
//           ...prev[platform],
//           enabled: newEnabled,
//         },
//       };
//     });
//   };

//   const updatePlatformValue = (platform, field, value) => {
//     setSocialMediaData(prev => ({
//       ...prev,
//       [platform]: {
//         ...prev[platform],
//         [field]: value,
//       },
//     }));
//   };

//   const renderPlatformRow = (platformKey, platformData) => {
//     const inputField =
//       platformKey === 'whatsapp'
//         ? 'number'
//         : platformKey === 'storeLink'
//         ? 'url'
//         : 'link';

//     return (
//       <View key={platformKey} style={styles.platformContainer}>
//         <View style={styles.platformHeader}>
//           <View style={styles.platformInfo}>
//             <View
//               style={[
//                 styles.iconContainer,
//                 {backgroundColor: `${platformData.iconColor}15`},
//               ]}>
//               <Icon
//                 name={platformData.icon}
//                 size={24}
//                 color={platformData.iconColor}
//               />
//             </View>
//             <View style={styles.platformText}>
//               <Text style={styles.platformTitle}>{platformData.title}</Text>
//               {platformData.hasAsyncValue && (
//                 <Text style={styles.asyncValueText}>
//                   {platformData.asyncValue.length > 30
//                     ? `${platformData.asyncValue.substring(0, 30)}...`
//                     : platformData.asyncValue}
//                 </Text>
//               )}
//             </View>
//           </View>
//           <Switch
//             value={platformData.enabled}
//             onValueChange={value => {
//               console.log(
//                 `Switch onValueChange called for ${platformKey} with value:`,
//                 value,
//               );
//               togglePlatform(platformKey);
//             }}
//             disabled={false}
//             trackColor={{
//               false: '#e0e0e0',
//               true: `${platformData.iconColor}30`,
//             }}
//             thumbColor={
//               platformData.enabled ? platformData.iconColor : '#f4f3f4'
//             }
//           />
//         </View>

//         {/* Always show input field - disabled when switch is ON */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={[
//               styles.textInput,
//               platformData.enabled && styles.disabledInput,
//             ]}
//             placeholder={platformData.placeholder}
//             value={
//               platformData.enabled
//                 ? platformData.asyncValue
//                 : platformData[inputField]
//             }
//             onChangeText={value =>
//               updatePlatformValue(platformKey, inputField, value)
//             }
//             placeholderTextColor="#999"
//             keyboardType={platformKey === 'whatsapp' ? 'phone-pad' : 'default'}
//             autoCapitalize="none"
//             editable={!platformData.enabled}
//           />
//         </View>
//       </View>
//     );
//   };

//   if (!visible) return null;

//   return (
//     <View style={styles.overlay}>
//       <TouchableOpacity
//         style={styles.backdrop}
//         activeOpacity={1}
//         onPress={onClose}
//       />
//       <Animated.View
//         style={[styles.container, {transform: [{translateY: slideAnim}]}]}>
//         {/* Handle Bar */}
//         <View style={styles.handleBar} />

//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Link Social Media</Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Icon name="close" size={24} color="#666" />
//           </TouchableOpacity>
//         </View>

//         {/* Social Media Platforms */}
//         <View style={styles.content}>
//           {Object.entries(socialMediaData).map(([key, data]) =>
//             renderPlatformRow(key, data),
//           )}
//         </View>

//         {/* Save Button */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.saveButton}
//             onPress={() => {
//               onApply(socialMediaData);
//               onClose();
//             }}>
//             <Text style={styles.saveButtonText}>Save Changes</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     zIndex: 3000,
//   },
//   backdrop: {
//     flex: 1,
//   },
//   container: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingBottom: 20,
//     minHeight: 320,
//   },
//   handleBar: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ddd',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginTop: 8,
//     marginBottom: 12,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   content: {
//     padding: 12,
//     paddingBottom: 4,
//   },
//   platformContainer: {
//     marginBottom: 8,
//   },
//   platformHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//   },
//   platformInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   iconContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   platformText: {
//     flex: 1,
//   },
//   platformTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 2,
//   },
//   asyncValueText: {
//     fontSize: 11,
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   inputContainer: {
//     marginTop: 4,
//     paddingHorizontal: 12,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 6,
//     padding: 8,
//     fontSize: 14,
//     backgroundColor: '#fff',
//     color: '#333',
//   },
//   disabledInput: {
//     backgroundColor: '#f5f5f5',
//     color: '#999',
//   },
//   buttonContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     paddingBottom: 8,
//   },
//   saveButton: {
//     backgroundColor: '#6366F1',
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default MediaBottomnav;
