// witt audio too 
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import ProductDropdown from './components/ProductDropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageGrid from './components/ImageGrid'; // Your ImageGrid component
import AudioRecorder from './components/AudioRecorder'; // The AudioRecorder component we just created

const CreatepostScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [description, setDescription] = useState('');
  const [showImageGrid, setShowImageGrid] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState(null);

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

  const handleAudioRecorded = (audioData) => {
    setUploadedAudio(audioData);
    console.log('Audio uploaded:', audioData);
  };

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
      ]
    );
  };

  const handleAddStore = () => {
    Alert.alert('Add Store', 'Store addition functionality');
  };

  const handleAddProduct = () => {
    Alert.alert('Add Product', 'Product addition functionality');
  };

  const handleLinkSocialMedia = () => {
    Alert.alert('Link Social Media', 'Social media linking functionality');
  };

  const handleAddSongs = () => {
    Alert.alert('Add Songs', 'Song addition functionality');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ActionButton = ({title, iconName, onPress, iconColor = '#666'}) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Icon name={iconName} size={24} color={iconColor} style={styles.buttonIcon} />
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <ActionButton
          title="Upload Photo/Video"
          iconName="photo-camera"
          onPress={handleUploadMedia}
          iconColor="#4CAF50"
        />
        
        {/* Audio Upload Section - Dynamic */}
        <AudioUploadSection />
        
        <ActionButton
          title="Add Store"
          iconName="store"
          onPress={handleAddStore}
          iconColor="#2196F3"
        />
        
        <ActionButton
          title="Add Product"
          iconName="shopping-cart"
          onPress={handleAddProduct}
          iconColor="#9C27B0"
        />
        
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

      {/* Product Dropdown */}
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Select Product (Optional)</Text>
        <ProductDropdown
          onProductSelect={handleProductSelect}
          selectedProductId={selectedProductId}
        />
      </View>

      {/* Selected Product Info */}
      {selectedProduct && (
        <View style={styles.selectedProductInfo}>
          <Text style={styles.selectedProductTitle}>Selected Product:</Text>
          <Text style={styles.productInfoText}>Name: {selectedProduct.productName}</Text>
          <Text style={styles.productInfoText}>
            Price: ${selectedProduct.finalPrice || selectedProduct.productPrice}
          </Text>
          <Text style={styles.productInfoText}>ID: {selectedProduct._id}</Text>
        </View>
      )}

      {/* Create Post Button */}
      <TouchableOpacity style={styles.createPostButton}>
        <Text style={styles.createPostButtonText}>Create Post</Text>
      </TouchableOpacity>

      {/* Image Grid Modal */}
      <ImageGrid
        visible={showImageGrid}
        onClose={() => setShowImageGrid(false)}
      />

      {/* Audio Recorder Modal */}
      <AudioRecorder
        visible={showAudioRecorder}
        onClose={() => setShowAudioRecorder(false)}
        onAudioRecorded={handleAudioRecorded}
      />
    </ScrollView>
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
});





// with image and audio upload buttons and description input
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

// const CreatepostScreen = () => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [description, setDescription] = useState('');

//   // Handle product selection from dropdown
//   const handleProductSelect = product => {
//     setSelectedProduct(product);
//     setSelectedProductId(product._id);
//     console.log('Selected product:', product);
//     console.log('Selected product ID:', product._id);
//   };

//   // Button handlers
//   const handleUploadMedia = () => {
//     Alert.alert('Upload Media', 'Photo/Video upload functionality');
//   };

//   const handleUploadAudio = () => {
//     Alert.alert('Upload Audio', 'Audio upload functionality');
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

//   const ActionButton = ({title, iconName, onPress, iconColor = '#666'}) => (
//     <TouchableOpacity style={styles.actionButton} onPress={onPress}>
//       <Icon name={iconName} size={24} color={iconColor} style={styles.buttonIcon} />
//       <Text style={styles.buttonText}>{title}</Text>
//     </TouchableOpacity>
//   );

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
        
//         <ActionButton
//           title="Upload Audio"
//           iconName="mic"
//           onPress={handleUploadAudio}
//           iconColor="#FF9800"
//         />
        
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
//     height: 60, // Reduced space since we have more content
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



// import {StyleSheet, Text, View, ScrollView} from 'react-native';
// import React, {useState} from 'react';
// import ProductDropdown from './components/ProductDropdown';

// const CreatepostScreen = () => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedProductId, setSelectedProductId] = useState(null);

//   // Handle product selection from dropdown
//   const handleProductSelect = product => {
//     setSelectedProduct(product);
//     setSelectedProductId(product._id);
//     console.log('Selected product:', product);
//     console.log('Selected product ID:', product._id);
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//       <View style={styles.topSpacer} />
      
//       <Text style={styles.title}>Create Post Screen</Text>

//       <ProductDropdown
//         onProductSelect={handleProductSelect}
//         selectedProductId={selectedProductId}
//       />

//       {selectedProduct && (
//         <View style={styles.selectedProductInfo}>
//           <Text style={styles.selectedProductTitle}>Selected Product:</Text>
//           <Text>Name: {selectedProduct.productName}</Text>
//           <Text>
//             Price: ${selectedProduct.finalPrice || selectedProduct.productPrice}
//           </Text>
//           <Text>ID: {selectedProduct._id}</Text>
//         </View>
//       )}
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
//     height: 220, // Space for upward dropdown
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   selectedProductInfo: {
//     marginTop: 20,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//   },
//   selectedProductTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
// });
