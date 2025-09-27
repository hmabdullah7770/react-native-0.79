// Updated CreatepostScreen with inline media upload and layout options
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import ProductBottomnav from './components/ProductBottomnav';
import {
  CreatePostProvider,
  useCreatePostContext,
} from './context/CreatePostContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InlineImageGrid from './components/InlineImageGrid'; // New inline component
import RecorderBottomnav from './components/RecorderBottomnav';
import ThumbnailBottomnav from './components/ThumbnailBottomnav';
import StoreBottomnav from './components/StoreBottomnav';

const CreatepostScreenContent = () => {
  const {clearApplied} = useCreatePostContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [description, setDescription] = useState('');
  const [showImageGrid, setShowImageGrid] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [showStoreBottomnav, setShowStoreBottomnav] = useState(false);
  const [appliedStore, setAppliedStore] = useState(null); // {type: 'store'|'url', value}
  const [showProductBottomnav, setShowProductBottomnav] = useState(false);
  const [appliedProduct, setAppliedProduct] = useState(null); // object or url

  // Video settings state
  const [showVideoSettings, setShowVideoSettings] = useState(false);
  const [videoSettingsData, setVideoSettingsData] = useState(null);
  const [modalUpdateTrigger, setModalUpdateTrigger] = useState(0);

  // Handle product selection from dropdown
  const handleProductSelect = product => {
    setSelectedProduct(product);
    setSelectedProductId(product._id);
    console.log('Selected product:', product);
    console.log('Selected product ID:', product._id);
  };

  // Button handlers
  const handleUploadMedia = () => {
    setShowImageGrid(true);
  };

  const handleUploadAudio = () => {
    setShowAudioRecorder(true);
  };

  const handleAudioRecorded = audioData => {
    setUploadedAudio(audioData);
    console.log('Audio uploaded:', audioData);
  };

  // Add useEffect to listen for state changes
  useEffect(() => {
    if (videoSettingsData?.lastUpdate) {
      // Force modal to regenerate items when state changes
      try {
        setModalUpdateTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error updating modal trigger:', error);
      }
    }
  }, [videoSettingsData?.lastUpdate]);

  const handleVideoSettingsOpen = data => {
    setVideoSettingsData({
      ...data,
      // Add reactive update mechanism
      onStateChange: newState => {
        // Force re-render of modal items
        setVideoSettingsData(prev => ({
          ...prev,
          ...newState,
          lastUpdate: Date.now(), // Force re-render trigger
        }));
      },
    });
    setShowVideoSettings(true);
  };

  const handleThumbnailUpload = (
    videoIndex = videoSettingsData?.currentVideoIndex,
  ) => {
    if (videoIndex === null || videoIndex === undefined || !videoSettingsData) {
      Alert.alert('Error', 'No video selected for thumbnail upload.');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      includeBase64: false,
    };

    try {
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled thumbnail picker');
          return;
        }

        if (response.error) {
          console.error('Thumbnail picker error:', response.error);
          Alert.alert('Error', 'Failed to select thumbnail. Please try again.');
          return;
        }

        if (!response.assets || response.assets.length === 0) {
          Alert.alert('Error', 'No thumbnail selected.');
          return;
        }

        const thumbnail = response.assets[0];

        // Validate file size (max 10MB for thumbnails)
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        if (thumbnail.fileSize && thumbnail.fileSize > maxFileSize) {
          Alert.alert('File Too Large', 'Thumbnail must be under 10MB.');
          return;
        }

        // Update thumbnail for specific video
        const newSettings = {
          ...videoSettingsData.videoSettings,
          thumbnails: {
            ...videoSettingsData.videoSettings.thumbnails,
            [videoIndex]: thumbnail,
          },
        };

        videoSettingsData.setVideoSettings(prev => ({
          ...prev,
          thumbnails: {
            ...prev.thumbnails,
            [videoIndex]: thumbnail,
          },
        }));

        // Notify parent of state change for real-time updates
        try {
          if (videoSettingsData?.onStateChange) {
            videoSettingsData.onStateChange({
              videoSettings: newSettings,
              lastUpdate: Date.now(),
            });
          }
        } catch (error) {
          console.error('Error updating thumbnail state:', error);
        }

        console.log(
          `Thumbnail uploaded for video ${videoIndex}:`,
          thumbnail.fileName,
        );
      });
    } catch (error) {
      console.error('Error launching thumbnail picker:', error);
      Alert.alert('Error', 'Failed to open thumbnail picker.');
    }
  };

  // Create items for ThumbnailBottomnav (Video Settings Only)
  const getVideoSettingsItems = useCallback(() => {
    if (!videoSettingsData) return [];

    const currentThumbnail =
      videoSettingsData.currentVideoIndex !== null
        ? videoSettingsData.videoSettings.thumbnails[
            videoSettingsData.currentVideoIndex
          ]
        : null;

    const items = [
      {
        type: 'button',
        icon: 'photo',
        iconColor: '#2196F3',
        title: currentThumbnail ? 'Change Thumbnail' : 'Upload Thumbnail',
        textColor: '#2196F3',
        showArrow: false,
        onPress: () =>
          handleThumbnailUpload(videoSettingsData.currentVideoIndex),
      },
      {
        type: 'divider',
      },
      {
        type: 'switch',
        icon: 'play-circle-filled',
        iconColor: '#4CAF50',
        title: 'Auto Play',
        description: 'Videos will play automatically',
        value: videoSettingsData.videoSettings.autoPlay,
        component: Switch,
        onToggle: value =>
          videoSettingsData.setVideoSettings(prev => ({
            ...prev,
            autoPlay: value,
          })),
      },
    ];

    if (currentThumbnail) {
      items.push({
        type: 'divider',
      });
      items.push({
        type: 'info',
        icon: 'check-circle',
        iconColor: '#4CAF50',
        title: 'Custom Thumbnail Active',
        description: `File: ${currentThumbnail.fileName || 'Custom thumbnail'}`,
      });
      items.push({
        type: 'button',
        icon: 'delete',
        iconColor: '#ff4757',
        title: 'Remove Thumbnail',
        textColor: '#ff4757',
        showArrow: false,
        onPress: () => {
          const newThumbnails = {...videoSettingsData.videoSettings.thumbnails};
          delete newThumbnails[videoSettingsData.currentVideoIndex];

          const newSettings = {
            ...videoSettingsData.videoSettings,
            thumbnails: newThumbnails,
          };

          videoSettingsData.setVideoSettings(prev => {
            const updatedThumbnails = {...prev.thumbnails};
            delete updatedThumbnails[videoSettingsData.currentVideoIndex];
            return {
              ...prev,
              thumbnails: updatedThumbnails,
            };
          });

          // Notify parent of state change for real-time updates
          try {
            if (videoSettingsData?.onStateChange) {
              videoSettingsData.onStateChange({
                videoSettings: newSettings,
                lastUpdate: Date.now(),
              });
            }
          } catch (error) {
            console.error('Error removing thumbnail state:', error);
          }
        },
      });
    }

    return items;
  }, [videoSettingsData, modalUpdateTrigger]);

  const handleRemoveAudio = () => {
    Alert.alert(
      'Remove Audio',
      'Are you sure you want to remove the uploaded audio?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setUploadedAudio(null),
        },
      ],
    );
  };

  const handleAddStore = () => {
    setShowStoreBottomnav(true);
  };

  const handleAddProduct = () => {
    // Open Product bottom sheet
    setShowProductBottomnav(true);
  };

  const handleLinkSocialMedia = () => {
    Alert.alert('Link Social Media', 'Social media linking functionality');
  };

  const handleAddSongs = () => {
    Alert.alert('Add Songs', 'Song addition functionality');
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const ActionButton = ({title, iconName, onPress, iconColor = '#666'}) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Icon
        name={iconName}
        size={24}
        color={iconColor}
        style={styles.buttonIcon}
      />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  // Audio Upload Component
  const AudioUploadSection = () => {
    if (uploadedAudio) {
      return (
        <View style={styles.uploadedAudioContainer}>
          <View style={styles.audioInfo}>
            <Icon name="audiotrack" size={20} color="#4CAF50" />
            <View style={styles.audioDetails}>
              <Text style={styles.audioTitle}>Audio Recording</Text>
              <Text style={styles.audioDuration}>
                Duration: {formatTime(uploadedAudio.duration)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removeAudioButton}
              onPress={handleRemoveAudio}>
              <Icon name="close" size={18} color="#ff4757" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <ActionButton
        title="Upload Audio"
        iconName="mic"
        onPress={handleUploadAudio}
        iconColor="#FF9800"
      />
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.topSpacer} />

      <Text style={styles.title}>Create Post Screen</Text>

      {/* Description Input */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Write Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="What's on your mind?"
          multiline={true}
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />
      </View>

      {/* Upload Photo/Video Button - Only show when grid is not active */}
      {!showImageGrid && (
        <View style={styles.actionsContainer}>
          <ActionButton
            title="Upload Photo/Video"
            iconName="photo-camera"
            onPress={handleUploadMedia}
            iconColor="#4CAF50"
          />
        </View>
      )}

      {/* Inline Image Grid - Shows when activated */}
      {showImageGrid && (
        <InlineImageGrid
          onClose={() => setShowImageGrid(false)}
          onMediaChange={mediaCount => {
            // You can use this to track media count if needed
            console.log('Media count changed:', mediaCount);
          }}
          onVideoSettingsOpen={handleVideoSettingsOpen}
        />
      )}

      {/* Action Buttons - Show after image grid or if no image grid */}
      <View style={styles.actionsContainer}>
        {/* Audio Upload Section - Dynamic */}
        <AudioUploadSection />

        {appliedStore ? (
          <View style={styles.appliedStorePill}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="store" size={18} color="#2196F3" />
              <Text style={{marginLeft: 8, fontWeight: '500'}}>
                {appliedStore.type === 'store'
                  ? 'Store attached'
                  : appliedStore.value}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.appliedRemove}
              onPress={() => {
                try {
                  clearApplied('store');
                  setAppliedStore(null);
                } catch (error) {
                  console.warn('Error clearing store applied state:', error);
                  setAppliedStore(null); // Still remove from UI
                }
              }}>
              <Icon name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ) : (
          <ActionButton
            title="Add Store"
            iconName="store"
            onPress={handleAddStore}
            iconColor="#2196F3"
          />
        )}

        {/* Applied Product Pill - mirrors appliedStore behavior so user can remove the attached product */}
        {appliedProduct ? (
          <View style={styles.appliedStorePill}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="shopping-cart" size={18} color="#9C27B0" />
              <Text style={{marginLeft: 8, fontWeight: '500'}}>
                {appliedProduct.type === 'product'
                  ? appliedProduct.value.productName || 'Product attached'
                  : appliedProduct.value || 'Product attached'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.appliedRemove}
              onPress={() => {
                try {
                  clearApplied('product');
                  setAppliedProduct(null);
                } catch (error) {
                  console.warn('Error clearing product applied state:', error);
                  setAppliedProduct(null); // Still remove from UI
                }
              }}>
              <Icon name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ) : (
          <ActionButton
            title="Add Product"
            iconName="shopping-cart"
            onPress={handleAddProduct}
            iconColor="#9C27B0"
          />
        )}

        <ActionButton
          title="Link Social Media"
          iconName="share"
          onPress={handleLinkSocialMedia}
          iconColor="#FF5722"
        />

        <ActionButton
          title="Add Songs"
          iconName="music-note"
          onPress={handleAddSongs}
          iconColor="#E91E63"
        />
      </View>

      {/* Product selection is now handled via ProductBottomnav (opened by Add Product)
      {appliedProduct && (
        <View style={styles.selectedProductInfo}>
          <Text style={styles.selectedProductTitle}>Selected Product:</Text>
          {appliedProduct.type === 'product' ? (
            <>
              <Text style={styles.productInfoText}>Name: {appliedProduct.value.productName}</Text>
              <Text style={styles.productInfoText}>Price: ${appliedProduct.value.finalPrice || appliedProduct.value.productPrice}</Text>
              <Text style={styles.productInfoText}>ID: {appliedProduct.value._id}</Text>
            </>
          ) : (
            <Text style={styles.productInfoText}>URL: {appliedProduct.value}</Text>
          )}
        </View>
      )} */}

      {/* Create Post Button */}
      <TouchableOpacity style={styles.createPostButton}>
        <Text style={styles.createPostButtonText}>Create Post</Text>
      </TouchableOpacity>

      {/* Audio Recorder Modal */}
      <RecorderBottomnav
        visible={showAudioRecorder}
        onClose={() => setShowAudioRecorder(false)}
        onAudioRecorded={handleAudioRecorded}
      />

      {/* Store Bottomnav Modal */}
      <StoreBottomnav
        visible={showStoreBottomnav}
        onClose={() => setShowStoreBottomnav(false)}
        onApply={data => {
          setAppliedStore(data);
          setShowStoreBottomnav(false);
        }}
        onRemove={() => {
          try {
            clearApplied('store');
            setAppliedStore(null);
          } catch (error) {
            console.warn('Error clearing store applied state:', error);
            setAppliedStore(null); // Still remove from UI
          }
        }}
      />

      {/* Product Bottomnav Modal */}
      <ProductBottomnav
        visible={showProductBottomnav}
        onClose={() => setShowProductBottomnav(false)}
        onApply={data => {
          // data: {type: 'product'|'url', value}
          setAppliedProduct(data);
          setShowProductBottomnav(false);
        }}
        onRemove={() => {
          try {
            clearApplied('product');
            setAppliedProduct(null);
          } catch (error) {
            console.warn('Error clearing product applied state:', error);
            setAppliedProduct(null); // Still remove from UI
          }
          setShowProductBottomnav(false);
        }}
      />

      {/* Video Settings Bottom Nav */}
      <ThumbnailBottomnav
        key={modalUpdateTrigger} // Force component re-mount on state changes
        visible={showVideoSettings}
        onClose={() => {
          setShowVideoSettings(false);
          if (videoSettingsData?.setShowVideoSettings) {
            videoSettingsData.setShowVideoSettings(false);
          }
        }}
        title="Video Settings"
        items={getVideoSettingsItems()}
        height={
          videoSettingsData?.currentVideoIndex !== null &&
          videoSettingsData?.videoSettings.thumbnails[
            videoSettingsData.currentVideoIndex
          ]
            ? 380
            : 250
        }
      />
    </ScrollView>
  );
};

const CreatepostScreen = () => {
  return (
    <CreatePostProvider>
      <CreatepostScreenContent />
    </CreatePostProvider>
  );
};

export default CreatepostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  topSpacer: {
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  // Audio Upload Styles
  uploadedAudioContainer: {
    marginBottom: 12,
    backgroundColor: '#f0fff4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  audioDetails: {
    flex: 1,
    marginLeft: 12,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  audioDuration: {
    fontSize: 14,
    color: '#666',
  },
  removeAudioButton: {
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  productSection: {
    marginBottom: 20,
  },
  selectedProductInfo: {
    marginTop: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  selectedProductTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  productInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  createPostButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appliedStorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cfe8ff',
    marginBottom: 12,
  },
  appliedRemove: {
    padding: 6,
  },
});

// // witt audio too
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import React, {useState} from 'react';
// import ProductDropdown from './components/ProductDropdown';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import ImageGrid from './components/ImageGrid'; // Your ImageGrid component
// import AudioRecorder from './components/AudioRecorder'; // The AudioRecorder component we just created

// const CreatepostScreen = () => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [description, setDescription] = useState('');
//   const [showImageGrid, setShowImageGrid] = useState(false);
//   const [showAudioRecorder, setShowAudioRecorder] = useState(false);
//   const [uploadedAudio, setUploadedAudio] = useState(null);

//   // Handle product selection from dropdown
//   const handleProductSelect = product => {
//     setSelectedProduct(product);
//     setSelectedProductId(product._id);
//     console.log('Selected product:', product);
//     console.log('Selected product ID:', product._id);
//   };

//   // Button handlers
//   const handleUploadMedia = () => {
//     setShowImageGrid(true);
//   };

//   const handleUploadAudio = () => {
//     setShowAudioRecorder(true);
//   };

//   const handleAudioRecorded = (audioData) => {
//     setUploadedAudio(audioData);
//     console.log('Audio uploaded:', audioData);
//   };

//   const handleRemoveAudio = () => {
//     Alert.alert(
//       'Remove Audio',
//       'Are you sure you want to remove the uploaded audio?',
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: () => setUploadedAudio(null),
//         },
//       ]
//     );
//   };

//   const handleAddStore = () => {
//     Alert.alert('Add Store', 'Store addition functionality');
//   };

//   const handleAddProduct = () => {
//     Alert.alert('Add Product', 'Product addition functionality');
//   };

//   const handleLinkSocialMedia = () => {
//     Alert.alert('Link Social Media', 'Social media linking functionality');
//   };

//   const handleAddSongs = () => {
//     Alert.alert('Add Songs', 'Song addition functionality');
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const ActionButton = ({title, iconName, onPress, iconColor = '#666'}) => (
//     <TouchableOpacity style={styles.actionButton} onPress={onPress}>
//       <Icon name={iconName} size={24} color={iconColor} style={styles.buttonIcon} />
//       <Text style={styles.buttonText}>{title}</Text>
//     </TouchableOpacity>
//   );

//   // Audio Upload Component
//   const AudioUploadSection = () => {
//     if (uploadedAudio) {
//       return (
//         <View style={styles.uploadedAudioContainer}>
//           <View style={styles.audioInfo}>
//             <Icon name="audiotrack" size={20} color="#4CAF50" />
//             <View style={styles.audioDetails}>
//               <Text style={styles.audioTitle}>Audio Recording</Text>
//               <Text style={styles.audioDuration}>
//                 Duration: {formatTime(uploadedAudio.duration)}
//               </Text>
//             </View>
//             <TouchableOpacity
//               style={styles.removeAudioButton}
//               onPress={handleRemoveAudio}>
//               <Icon name="close" size={18} color="#ff4757" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     }

//     return (
//       <ActionButton
//         title="Upload Audio"
//         iconName="mic"
//         onPress={handleUploadAudio}
//         iconColor="#FF9800"
//       />
//     );
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//       <View style={styles.topSpacer} />

//       <Text style={styles.title}>Create Post Screen</Text>

//       {/* Description Input */}
//       <View style={styles.descriptionContainer}>
//         <Text style={styles.sectionTitle}>Write Description</Text>
//         <TextInput
//           style={styles.descriptionInput}
//           placeholder="What's on your mind?"
//           multiline={true}
//           numberOfLines={4}
//           value={description}
//           onChangeText={setDescription}
//           textAlignVertical="top"
//         />
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionsContainer}>
//         <ActionButton
//           title="Upload Photo/Video"
//           iconName="photo-camera"
//           onPress={handleUploadMedia}
//           iconColor="#4CAF50"
//         />

//         {/* Audio Upload Section - Dynamic */}
//         <AudioUploadSection />

//         <ActionButton
//           title="Add Store"
//           iconName="store"
//           onPress={handleAddStore}
//           iconColor="#2196F3"
//         />

//         <ActionButton
//           title="Add Product"
//           iconName="shopping-cart"
//           onPress={handleAddProduct}
//           iconColor="#9C27B0"
//         />

//         <ActionButton
//           title="Link Social Media"
//           iconName="share"
//           onPress={handleLinkSocialMedia}
//           iconColor="#FF5722"
//         />

//         <ActionButton
//           title="Add Songs"
//           iconName="music-note"
//           onPress={handleAddSongs}
//           iconColor="#E91E63"
//         />
//       </View>

//       {/* Product Dropdown */}
//       <View style={styles.productSection}>
//         <Text style={styles.sectionTitle}>Select Product (Optional)</Text>
//         <ProductDropdown
//           onProductSelect={handleProductSelect}
//           selectedProductId={selectedProductId}
//         />
//       </View>

//       {/* Selected Product Info */}
//       {selectedProduct && (
//         <View style={styles.selectedProductInfo}>
//           <Text style={styles.selectedProductTitle}>Selected Product:</Text>
//           <Text style={styles.productInfoText}>Name: {selectedProduct.productName}</Text>
//           <Text style={styles.productInfoText}>
//             Price: ${selectedProduct.finalPrice || selectedProduct.productPrice}
//           </Text>
//           <Text style={styles.productInfoText}>ID: {selectedProduct._id}</Text>
//         </View>
//       )}

//       {/* Create Post Button */}
//       <TouchableOpacity style={styles.createPostButton}>
//         <Text style={styles.createPostButtonText}>Create Post</Text>
//       </TouchableOpacity>

//       {/* Image Grid Modal */}
//       <ImageGrid
//         visible={showImageGrid}
//         onClose={() => setShowImageGrid(false)}
//       />

//       {/* Audio Recorder Modal */}
//       <AudioRecorder
//         visible={showAudioRecorder}
//         onClose={() => setShowAudioRecorder(false)}
//         onAudioRecorded={handleAudioRecorded}
//       />
//     </ScrollView>
//   );
// };

// export default CreatepostScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   contentContainer: {
//     padding: 16,
//     paddingBottom: 50,
//   },
//   topSpacer: {
//     height: 60,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   descriptionContainer: {
//     marginBottom: 24,
//   },
//   descriptionInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     minHeight: 100,
//     backgroundColor: '#f9f9f9',
//   },
//   actionsContainer: {
//     marginBottom: 24,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   buttonIcon: {
//     marginRight: 12,
//   },
//   buttonText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   // Audio Upload Styles
//   uploadedAudioContainer: {
//     marginBottom: 12,
//     backgroundColor: '#f0fff4',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#c8e6c9',
//   },
//   audioInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//   },
//   audioDetails: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   audioTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 2,
//   },
//   audioDuration: {
//     fontSize: 14,
//     color: '#666',
//   },
//   removeAudioButton: {
//     padding: 8,
//     backgroundColor: '#ffebee',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#ffcdd2',
//   },
//   productSection: {
//     marginBottom: 20,
//   },
//   selectedProductInfo: {
//     marginTop: 16,
//     marginBottom: 20,
//     padding: 16,
//     backgroundColor: '#f0f8ff',
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2196F3',
//   },
//   selectedProductTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#333',
//   },
//   productInfoText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   createPostButton: {
//     backgroundColor: '#2196F3',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 20,
//     shadowColor: '#2196F3',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   createPostButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
