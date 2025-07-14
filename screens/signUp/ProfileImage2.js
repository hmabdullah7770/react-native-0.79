// claude code


import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NextButton from './components/NextButton';

const ProfileImage2 = ({ route, navigation }) => {
  // Get params from previous screen
  const { email, username, password, otp } = route?.params || {};
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [tempImage, setTempImage] = useState(null); // For preview before apply
  const [isApplying, setIsApplying] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  // Storage keys
  const PROFILE_IMAGE_KEY = `profile_image_${username || email}`;
  const PROFILE_BIO_KEY = `profile_bio_${username || email}`;

  useEffect(() => {
    checkCameraPermission();
    loadStoredData();
  }, []);

  // Check camera permission
  const checkCameraPermission = async () => {
    const permission = await Camera.getCameraPermissionStatus();
    setCameraPermission(permission);
    
    if (permission === 'not-determined') {
      const newPermission = await Camera.requestCameraPermission();
      setCameraPermission(newPermission);
    }
  };

  // Load stored image and bio
  const loadStoredData = async () => {
    try {
      const storedImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
      const storedBio = await AsyncStorage.getItem(PROFILE_BIO_KEY);
      
      if (storedImage) {
        setImage(JSON.parse(storedImage));
      }
      if (storedBio) {
        setBio(storedBio);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  // Store image locally
  const storeImageLocally = async (imageData) => {
    try {
      await AsyncStorage.setItem(PROFILE_IMAGE_KEY, JSON.stringify(imageData));
      console.log('Image stored successfully');
    } catch (error) {
      console.error('Error storing image:', error);
      Alert.alert('Error', 'Failed to store image locally');
    }
  };

  // Store bio locally
  const storeBioLocally = async (bioText) => {
    try {
      await AsyncStorage.setItem(PROFILE_BIO_KEY, bioText);
    } catch (error) {
      console.error('Error storing bio:', error);
    }
  };

  // Clear stored image
  const clearStoredImage = async () => {
    try {
      await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
      setImage(null);
      setTempImage(null);
      Alert.alert('Success', 'Image cleared successfully');
    } catch (error) {
      console.error('Error clearing image:', error);
      Alert.alert('Error', 'Failed to clear image');
    }
  };

  // Handle plus button press (show options)
  const handlePlusPress = () => {
    setShowModal(true);
  };

  // Handle camera option
  const handleCameraOption = async () => {
    setShowModal(false);
    if (cameraPermission === 'authorized') {
      setShowCamera(true);
    } else {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
    }
  };

  // Handle gallery option
  const handleGalleryOption = () => {
    setShowModal(false);
    handleImagePicker();
  };

  // Camera capture
  const handleCameraCapture = async (camera) => {
    try {
      const photo = await camera.takePhoto({
        qualityPrioritization: 'speed',
        flash: 'off',
        enableAutoRedEyeReduction: true,
      });
      
      const imageData = {
        uri: `file://${photo.path}`,
        fileName: `camera_${Date.now()}.jpg`,
        type: 'image/jpeg',
        fileSize: photo.fileSize || 0,
      };
      
      setTempImage(imageData);
      setShowCamera(false);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Gallery image picker
  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1200,
      maxWidth: 1200,
      quality: 0.8,
      selectionLimit: 1,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Error', 'Image selection failed. Please try again.');
        return;
      }
      if (result.assets && result.assets.length > 0) {
        setTempImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };

  // Apply selected image
  const handleApplyImage = async () => {
    if (!tempImage) return;
    
    setIsApplying(true);
    
    try {
      // Clear previous image before storing new one
      if (image) {
        await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
      }
      
      // Store new image
      await storeImageLocally(tempImage);
      setImage(tempImage);
      setTempImage(null);
      
      Alert.alert('Success', 'Image applied successfully');
    } catch (error) {
      console.error('Error applying image:', error);
      Alert.alert('Error', 'Failed to apply image');
    } finally {
      setIsApplying(false);
    }
  };

  // Cancel temp image selection
  const handleCancelImage = () => {
    setTempImage(null);
  };

  // Handle bio change and auto-save
  const handleBioChange = (text) => {
    setBio(text);
    // Auto-save bio with debouncing could be added here
  };

  // Save bio manually
  const handleSaveBio = async () => {
    await storeBioLocally(bio);
    Alert.alert('Success', 'Bio saved successfully');
  };

  // Button enabled only if image and bio are present
  const isButtonDisabled = !image || !bio.trim();

  // Next handler: pass all data to SocialLink2
  const handleNext = () => {
    navigation.navigate('SignupScreens', {
      screen: 'SocialLink2',
      params: {
        email,
        username,
        password,
        otp,
        image,
        bio,
      },
    });
  };

  if (showCamera && device) {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
          ref={(ref) => {
            if (ref) {
              // Add capture button
              setTimeout(() => {
                // This would be handled by a capture button in real implementation
              }, 100);
            }
          }}
        />
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowCamera(false)}
          >
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => {
              // Get camera ref and take photo
              const cameraRef = Camera.current;
              if (cameraRef) {
                handleCameraCapture(cameraRef);
              }
            }}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Picture</Text>
      
      <View style={styles.imageContainer}>
        {(tempImage || image) ? (
          <Image 
            source={{ uri: tempImage?.uri || image?.uri }} 
            style={styles.profileImage} 
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="person" size={80} color="#dddddd" />
          </View>
        )}
        
        <TouchableOpacity style={styles.addButton} onPress={handlePlusPress}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Image action buttons */}
      {tempImage && (
        <View style={styles.imageActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.applyButton]}
            onPress={handleApplyImage}
            disabled={isApplying}
          >
            <Text style={styles.actionButtonText}>
              {isApplying ? 'Applying...' : 'Apply'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelActionButton]}
            onPress={handleCancelImage}
          >
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Clear image button */}
      {image && !tempImage && (
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={clearStoredImage}
        >
          <Text style={styles.actionButtonText}>Clear Image</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.bioInput}
        placeholder="Write your bio..."
        value={bio}
        onChangeText={handleBioChange}
        multiline
        maxLength={200}
      />

      <TouchableOpacity
        style={styles.saveBioButton}
        onPress={handleSaveBio}
      >
        <Text style={styles.saveBioButtonText}>Save Bio</Text>
      </TouchableOpacity>

      <NextButton onPress={handleNext} disabled={isButtonDisabled} />

      {/* Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Image Source</Text>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleCameraOption}
            >
              <Icon name="camera-alt" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleGalleryOption}
            >
              <Icon name="photo-library" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileImage2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    backgroundColor: '#f8f8f8',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#f9213f',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  imageActions: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
  },
  cancelActionButton: {
    backgroundColor: '#f44336',
  },
  clearButton: {
    backgroundColor: '#ff9800',
    marginBottom: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bioInput: {
    width: '100%',
    minHeight: 60,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  saveBioButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 24,
  },
  saveBioButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cancelButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  placeholder: {
    width: 50,
    height: 50,
  },
});




// import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
// import React, { useState } from 'react';
// import { launchImageLibrary } from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import NextButton from './components/NextButton';

// const ProfileImage2 = ({ route, navigation }) => {
//   // Get params from previous screen
//   const { email, username, password, otp } = route?.params || {};
//   const [image, setImage] = useState(null);
//   const [bio, setBio] = useState('');

//   // Image picker handler
//   const handleImagePicker = async () => {
//     const options = {
//       mediaType: 'photo',
//       includeBase64: false,
//       maxHeight: 1200,
//       maxWidth: 1200,
//       quality: 0.8,
//       selectionLimit: 1,
//     };

//     try {
//       const result = await launchImageLibrary(options);
//       if (result.didCancel) return;
//       if (result.errorCode) {
//         Alert.alert('Error', 'Image selection failed. Please try again.');
//         return;
//       }
//       if (result.assets && result.assets.length > 0) {
//         setImage(result.assets[0]);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong while selecting the image.');
//     }
//   };

//   // Button enabled only if image and bio are present
//   const isButtonDisabled = !image || !bio.trim();

//   // Next handler: pass all data to SocialLink2
//   const handleNext = () => {
//     navigation.navigate('SignupScreens', {
//       screen: 'SocialLink2',
//       params: {
//         email,
//         username,
//         password,
//         otp,
//         image, // contains uri, fileName, type, etc.
//         bio,
//       },
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Profile Picture</Text>
//       <View style={styles.imageContainer}>
//         {image ? (
//           <Image source={{ uri: image.uri }} style={styles.profileImage} />
//         ) : (
//           <View style={styles.imagePlaceholder}>
//             <Icon name="person" size={80} color="#dddddd" />
//           </View>
//         )}
//         <TouchableOpacity style={styles.addButton} onPress={handleImagePicker}>
//           <Icon name="add" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>
//       <TextInput
//         style={styles.bioInput}
//         placeholder="Write your bio..."
//         value={bio}
//         onChangeText={setBio}
//         multiline
//         maxLength={200}
//       />
//       <NextButton onPress={handleNext} disabled={isButtonDisabled} />
//     </View>
//   );
// };

// export default ProfileImage2;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     padding: 24,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 32,
//   },
//   imageContainer: {
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     borderWidth: 2,
//     borderColor: '#eee',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//     position: 'relative',
//     backgroundColor: '#f8f8f8',
//   },
//   profileImage: {
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//   },
//   imagePlaceholder: {
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//   },
//   addButton: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//     backgroundColor: '#f9213f',
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//   },
//   bioInput: {
//     width: '100%',
//     minHeight: 60,
//     borderColor: '#eee',
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 24,
//     fontSize: 16,
//     backgroundColor: '#fafafa',
//   },
// });