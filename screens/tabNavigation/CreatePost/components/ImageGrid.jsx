import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import BottomNav from './bottomnav'; // Import your BottomNav component

const ImageGrid = ({visible, onClose}) => {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState('1'); // Default layout
  const [videoSettings, setVideoSettings] = useState({
    autoPlay: true,
    thumbnail: null,
  });
  const [showVideoSettings, setShowVideoSettings] = useState(false);
  const [videoSettingsAutoOpened, setVideoSettingsAutoOpened] = useState(false);

  if (!visible) return null;

  const handleMediaUpload = () => {
    const options = {
      mediaType: 'mixed',
      quality: 0.8,
      selectionLimit: 10,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel || response.error) return;

      const newMedia = response.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type,
        fileName: asset.fileName,
        fileSize: asset.fileSize,
        isVideo: asset.type?.includes('video'),
      }));

      setSelectedMedia(prev => [...prev, ...newMedia]);
      
      // Auto-show video settings if any video is uploaded and hasn't been auto-opened before
      const hasVideo = newMedia.some(media => media.isVideo);
      if (hasVideo && !videoSettingsAutoOpened) {
        setShowVideoSettings(true);
        setVideoSettingsAutoOpened(true);
      }
    });
  };

  const handleRemoveMedia = index => {
    const updatedMedia = selectedMedia.filter((_, i) => i !== index);
    setSelectedMedia(updatedMedia);
    
    // Hide video settings if no videos remaining
    const hasVideo = updatedMedia.some(media => media.isVideo);
    if (!hasVideo) {
      setShowVideoSettings(false);
      setVideoSettingsAutoOpened(false);
      // Reset video settings when no videos
      setVideoSettings({
        autoPlay: true,
        thumbnail: null,
      });
    }
  };

  const handleRemoveAllMedia = () => {
    Alert.alert(
      'Remove All Media',
      'Are you sure you want to remove all uploaded media?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove All',
          style: 'destructive',
          onPress: () => {
            setSelectedMedia([]);
            setShowVideoSettings(false);
            setVideoSettingsAutoOpened(false);
            setVideoSettings({
              autoPlay: true,
              thumbnail: null,
            });
            // Reset to default layout when all media is removed
            setSelectedLayout('1');
          },
        },
      ]
    );
  };

  const handleThumbnailUpload = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel || response.error) return;

      setVideoSettings(prev => ({
        ...prev,
        thumbnail: response.assets[0],
      }));
    });
  };

  // Handle video click to show settings
  const handleVideoClick = () => {
    setShowVideoSettings(true);
  };

  // Create items for BottomNav
  const getVideoSettingsItems = () => {
    const items = [
      {
        type: 'switch',
        icon: 'play-circle-filled',
        iconColor: '#4CAF50',
        title: 'Auto Play',
        description: 'Videos will play automatically',
        value: videoSettings.autoPlay,
        component: Switch,
        onToggle: (value) => setVideoSettings(prev => ({...prev, autoPlay: value}))
      },
      {
        type: 'divider'
      },
      {
        type: 'button',
        icon: 'photo',
        iconColor: '#2196F3',
        title: videoSettings.thumbnail ? 'Change Thumbnail' : 'Upload Custom Thumbnail',
        textColor: '#2196F3',
        showArrow: true,
        onPress: handleThumbnailUpload
      }
    ];

    // Add thumbnail preview info if thumbnail exists
    if (videoSettings.thumbnail) {
      items.push({
        type: 'info',
        icon: 'check-circle',
        iconColor: '#4CAF50',
        title: 'Custom Thumbnail Set',
        description: 'Tap above to change thumbnail',
      });
    }

    return items;
  };

  const layoutOptions = [
    {id: '1', label: '1', cols: 1},
    {id: '2', label: '2', cols: 2},
    {id: '2x2', label: '2x2', cols: 2, special: true},
    {id: 'carousel', label: 'Carousel', cols: 'carousel'},
    {id: '1x3', label: '1x3', cols: 3},
    {id: '1x2', label: '1x2', cols: 2, rows: 1},
  ];

  const renderMediaGrid = () => {
    if (selectedMedia.length === 0) {
      return (
        <TouchableOpacity style={styles.uploadPlaceholder} onPress={handleMediaUpload}>
          <Icon name="add" size={40} color="#666" />
          <Text style={styles.uploadText}>Tap to upload media</Text>
          <Text style={styles.uploadSubText}>Photos and videos</Text>
        </TouchableOpacity>
      );
    }

    const cols = selectedLayout === 'carousel' ? 1 : 
                 layoutOptions.find(l => l.id === selectedLayout)?.cols || 1;
    const hasVideos = selectedMedia.some(media => media.isVideo);

    return (
      <View style={styles.mediaContainer}>
        {/* Media Grid Header with Remove All Button */}
        <View style={styles.mediaHeader}>
          <Text style={styles.mediaCount}>
            {selectedMedia.length} {selectedMedia.length === 1 ? 'item' : 'items'} selected
          </Text>
          <TouchableOpacity 
            style={styles.removeAllButton} 
            onPress={handleRemoveAllMedia}
          >
            <Icon name="delete-outline" size={20} color="#ff4757" />
            <Text style={styles.removeAllText}>Remove All</Text>
          </TouchableOpacity>
        </View>

        {/* Video Settings Access Hint */}
        {hasVideos && (
          <TouchableOpacity style={styles.videoSettingsHint} onPress={handleVideoClick}>
            <Icon name="video-settings" size={20} color="#2196F3" />
            <Text style={styles.videoSettingsHintText}>
              Click here to customize video settings (thumbnail, autoplay)
            </Text>
            <Icon name="chevron-right" size={16} color="#2196F3" />
          </TouchableOpacity>
        )}

        <View style={[styles.mediaGrid, {flexDirection: cols === 1 ? 'column' : 'row'}]}>
          {selectedMedia.map((media, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.mediaItem,
                {
                  width: cols === 1 ? '100%' : cols === 2 ? '48%' : '31%',
                  marginRight: cols > 1 && (index + 1) % cols !== 0 ? '2%' : 0,
                },
              ]}
              onPress={media.isVideo ? handleVideoClick : undefined}
              activeOpacity={media.isVideo ? 0.7 : 1}>
              <Image source={{uri: media.uri}} style={styles.mediaImage} />
              {media.isVideo && (
                <View style={styles.videoOverlay}>
                  <Icon name="play-circle-filled" size={30} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.videoClickHint}>Tap for settings</Text>
                </View>
              )}
              {/* Enhanced Remove Button */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMedia(index)}
                activeOpacity={0.7}>
                <Icon name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          {/* Add More Button */}
          <TouchableOpacity style={styles.addMoreButton} onPress={handleMediaUpload}>
            <Icon name="add" size={24} color="#666" />
            <Text style={styles.addMoreText}>Add More</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Upload Media</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Media Grid */}
          <View style={styles.gridContainer}>
            {renderMediaGrid()}
          </View>

          {/* Layout Options - Only show when media is uploaded */}
          {selectedMedia.length > 0 && (
            <View style={styles.layoutSection}>
              <Text style={styles.sectionTitle}>Layout Style</Text>
              <Text style={styles.sectionDescription}>
                Choose how your media will be displayed
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.layoutOptions}>
                  {layoutOptions.map(option => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.layoutButton,
                        selectedLayout === option.id && styles.selectedLayout,
                      ]}
                      onPress={() => setSelectedLayout(option.id)}>
                      <Text
                        style={[
                          styles.layoutText,
                          selectedLayout === option.id && styles.selectedLayoutText,
                        ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Empty state message when no media */}
          {selectedMedia.length === 0 && (
            <View style={styles.emptyStateInfo}>
              <Icon name="info-outline" size={20} color="#666" />
              <Text style={styles.emptyStateText}>
                Upload photos or videos to see layout options and settings
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Done Button */}
        <TouchableOpacity 
          style={[
            styles.doneButton,
            selectedMedia.length === 0 && styles.doneButtonDisabled
          ]} 
          onPress={onClose}
          disabled={selectedMedia.length === 0}>
          <Text style={[
            styles.doneButtonText,
            selectedMedia.length === 0 && styles.doneButtonTextDisabled
          ]}>
            {selectedMedia.length === 0 ? 'Upload Media First' : `Done (${selectedMedia.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Video Settings Bottom Nav */}
      <BottomNav
        visible={showVideoSettings && selectedMedia.some(media => media.isVideo)}
        onClose={() => setShowVideoSettings(false)}
        title="Video Settings"
        items={getVideoSettingsItems()}
        height={videoSettings.thumbnail ? 280 : 200}
      />
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
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  gridContainer: {
    marginBottom: 20,
  },
  uploadPlaceholder: {
    height: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 8,
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  uploadSubText: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  mediaContainer: {
    minHeight: 200,
  },
  mediaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  mediaCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  removeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  removeAllText: {
    color: '#ff4757',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  videoSettingsHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  videoSettingsHintText: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    color: '#1565c0',
    fontWeight: '500',
  },
  mediaGrid: {
    flexWrap: 'wrap',
  },
  mediaItem: {
    height: 120,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -15}, {translateY: -15}],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  videoClickHint: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 71, 87, 0.9)',
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  addMoreButton: {
    width: '48%',
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addMoreText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  layoutSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  layoutOptions: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  layoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedLayout: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  layoutText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedLayoutText: {
    color: '#fff',
  },
  emptyStateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 20,
  },
  emptyStateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  doneButton: {
    margin: 16,
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButtonTextDisabled: {
    color: '#999',
  },
});

export default ImageGrid;


// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Alert,
//   Switch,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {launchImageLibrary} from 'react-native-image-picker';

// const ImageGrid = ({visible, onClose}) => {
//   const [selectedMedia, setSelectedMedia] = useState([]);
//   const [selectedLayout, setSelectedLayout] = useState('1'); // Default layout
//   const [videoSettings, setVideoSettings] = useState({
//     autoPlay: true,
//     thumbnail: null,
//   });
//   const [showVideoSettings, setShowVideoSettings] = useState(false);

//   if (!visible) return null;

//   const handleMediaUpload = () => {
//     const options = {
//       mediaType: 'mixed',
//       quality: 0.8,
//       selectionLimit: 10,
//     };

//     launchImageLibrary(options, response => {
//       if (response.didCancel || response.error) return;

//       const newMedia = response.assets.map(asset => ({
//         uri: asset.uri,
//         type: asset.type,
//         fileName: asset.fileName,
//         fileSize: asset.fileSize,
//         isVideo: asset.type?.includes('video'),
//       }));

//       setSelectedMedia(prev => [...prev, ...newMedia]);
      
//       // Show video settings if any video is uploaded
//       const hasVideo = newMedia.some(media => media.isVideo);
//       if (hasVideo) {
//         setShowVideoSettings(true);
//       }
//     });
//   };

//   const handleRemoveMedia = index => {
//     const updatedMedia = selectedMedia.filter((_, i) => i !== index);
//     setSelectedMedia(updatedMedia);
    
//     // Hide video settings if no videos remaining
//     const hasVideo = updatedMedia.some(media => media.isVideo);
//     if (!hasVideo) {
//       setShowVideoSettings(false);
//       // Reset video settings when no videos
//       setVideoSettings({
//         autoPlay: true,
//         thumbnail: null,
//       });
//     }
//   };

//   const handleRemoveAllMedia = () => {
//     Alert.alert(
//       'Remove All Media',
//       'Are you sure you want to remove all uploaded media?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Remove All',
//           style: 'destructive',
//           onPress: () => {
//             setSelectedMedia([]);
//             setShowVideoSettings(false);
//             setVideoSettings({
//               autoPlay: true,
//               thumbnail: null,
//             });
//             // Reset to default layout when all media is removed
//             setSelectedLayout('1');
//           },
//         },
//       ]
//     );
//   };

//   const handleThumbnailUpload = () => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//     };

//     launchImageLibrary(options, response => {
//       if (response.didCancel || response.error) return;

//       setVideoSettings(prev => ({
//         ...prev,
//         thumbnail: response.assets[0],
//       }));
//     });
//   };

//   const layoutOptions = [
//     {id: '1', label: '1', cols: 1},
//     {id: '2', label: '2', cols: 2},
//     {id: '2x2', label: '2x2', cols: 2, special: true},
//     {id: 'carousel', label: 'Carousel', cols: 'carousel'},
//     {id: '1x3', label: '1x3', cols: 3},
//     {id: '1x2', label: '1x2', cols: 2, rows: 1},
//   ];

//   const renderMediaGrid = () => {
//     if (selectedMedia.length === 0) {
//       return (
//         <TouchableOpacity style={styles.uploadPlaceholder} onPress={handleMediaUpload}>
//           <Icon name="add" size={40} color="#666" />
//           <Text style={styles.uploadText}>Tap to upload media</Text>
//           <Text style={styles.uploadSubText}>Photos and videos</Text>
//         </TouchableOpacity>
//       );
//     }

//     const cols = selectedLayout === 'carousel' ? 1 : 
//                  layoutOptions.find(l => l.id === selectedLayout)?.cols || 1;

//     return (
//       <View style={styles.mediaContainer}>
//         {/* Media Grid Header with Remove All Button */}
//         <View style={styles.mediaHeader}>
//           <Text style={styles.mediaCount}>
//             {selectedMedia.length} {selectedMedia.length === 1 ? 'item' : 'items'} selected
//           </Text>
//           <TouchableOpacity 
//             style={styles.removeAllButton} 
//             onPress={handleRemoveAllMedia}
//           >
//             <Icon name="delete-outline" size={20} color="#ff4757" />
//             <Text style={styles.removeAllText}>Remove All</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={[styles.mediaGrid, {flexDirection: cols === 1 ? 'column' : 'row'}]}>
//           {selectedMedia.map((media, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.mediaItem,
//                 {
//                   width: cols === 1 ? '100%' : cols === 2 ? '48%' : '31%',
//                   marginRight: cols > 1 && (index + 1) % cols !== 0 ? '2%' : 0,
//                 },
//               ]}>
//               <Image source={{uri: media.uri}} style={styles.mediaImage} />
//               {media.isVideo && (
//                 <View style={styles.videoOverlay}>
//                   <Icon name="play-circle-filled" size={30} color="rgba(255,255,255,0.9)" />
//                 </View>
//               )}
//               {/* Enhanced Remove Button */}
//               <TouchableOpacity
//                 style={styles.removeButton}
//                 onPress={() => handleRemoveMedia(index)}
//                 activeOpacity={0.7}>
//                 <Icon name="close" size={18} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           ))}
          
//           {/* Add More Button */}
//           <TouchableOpacity style={styles.addMoreButton} onPress={handleMediaUpload}>
//             <Icon name="add" size={24} color="#666" />
//             <Text style={styles.addMoreText}>Add More</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.overlay}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Upload Media</Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Icon name="close" size={24} color="#333" />
//           </TouchableOpacity>
//         </View>

//         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//           {/* Media Grid */}
//           <View style={styles.gridContainer}>
//             {renderMediaGrid()}
//           </View>

//           {/* Layout Options - Only show when media is uploaded */}
//           {selectedMedia.length > 0 && (
//             <View style={styles.layoutSection}>
//               <Text style={styles.sectionTitle}>Layout Style</Text>
//               <Text style={styles.sectionDescription}>
//                 Choose how your media will be displayed
//               </Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 <View style={styles.layoutOptions}>
//                   {layoutOptions.map(option => (
//                     <TouchableOpacity
//                       key={option.id}
//                       style={[
//                         styles.layoutButton,
//                         selectedLayout === option.id && styles.selectedLayout,
//                       ]}
//                       onPress={() => setSelectedLayout(option.id)}>
//                       <Text
//                         style={[
//                           styles.layoutText,
//                           selectedLayout === option.id && styles.selectedLayoutText,
//                         ]}>
//                         {option.label}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </ScrollView>
//             </View>
//           )}

//           {/* Video Settings - Only show when videos are present */}
//           {showVideoSettings && selectedMedia.some(media => media.isVideo) && (
//             <View style={styles.videoSettingsSection}>
//               <Text style={styles.sectionTitle}>Video Settings</Text>
              
//               {/* Auto Play */}
//               <View style={styles.settingRow}>
//                 <View style={styles.settingInfo}>
//                   <Text style={styles.settingTitle}>Auto Play</Text>
//                   <Text style={styles.settingDescription}>
//                     Videos will play automatically
//                   </Text>
//                 </View>
//                 <Switch
//                   value={videoSettings.autoPlay}
//                   onValueChange={value =>
//                     setVideoSettings(prev => ({...prev, autoPlay: value}))
//                   }
//                   trackColor={{false: '#767577', true: '#81b0ff'}}
//                   thumbColor={videoSettings.autoPlay ? '#2196F3' : '#f4f3f4'}
//                 />
//               </View>

//               {/* Thumbnail Upload */}
//               <TouchableOpacity
//                 style={styles.thumbnailButton}
//                 onPress={handleThumbnailUpload}>
//                 <Icon name="photo" size={20} color="#2196F3" />
//                 <Text style={styles.thumbnailButtonText}>
//                   {videoSettings.thumbnail ? 'Change Thumbnail' : 'Upload Custom Thumbnail'}
//                 </Text>
//                 <Icon name="chevron-right" size={20} color="#666" />
//               </TouchableOpacity>

//               {videoSettings.thumbnail && (
//                 <View style={styles.thumbnailPreview}>
//                   <Text style={styles.thumbnailPreviewTitle}>Custom Thumbnail:</Text>
//                   <View style={styles.thumbnailContainer}>
//                     <Image
//                       source={{uri: videoSettings.thumbnail.uri}}
//                       style={styles.thumbnailImage}
//                     />
//                     <TouchableOpacity
//                       style={styles.removeThumbnail}
//                       onPress={() =>
//                         setVideoSettings(prev => ({...prev, thumbnail: null}))
//                       }>
//                       <Icon name="close" size={16} color="#fff" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//             </View>
//           )}

//           {/* Empty state message when no layout options or video settings */}
//           {selectedMedia.length === 0 && (
//             <View style={styles.emptyStateInfo}>
//               <Icon name="info-outline" size={20} color="#666" />
//               <Text style={styles.emptyStateText}>
//                 Upload photos or videos to see layout options and settings
//               </Text>
//             </View>
//           )}
//         </ScrollView>

//         {/* Done Button */}
//         <TouchableOpacity 
//           style={[
//             styles.doneButton,
//             selectedMedia.length === 0 && styles.doneButtonDisabled
//           ]} 
//           onPress={onClose}
//           disabled={selectedMedia.length === 0}>
//           <Text style={[
//             styles.doneButtonText,
//             selectedMedia.length === 0 && styles.doneButtonTextDisabled
//           ]}>
//             {selectedMedia.length === 0 ? 'Upload Media First' : `Done (${selectedMedia.length})`}
//           </Text>
//         </TouchableOpacity>
//       </View>
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
//     zIndex: 1000,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     marginTop: 50,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   gridContainer: {
//     marginBottom: 20,
//   },
//   uploadPlaceholder: {
//     height: 200,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#ddd',
//     borderStyle: 'dashed',
//   },
//   uploadText: {
//     marginTop: 8,
//     color: '#333',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   uploadSubText: {
//     color: '#666',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   mediaContainer: {
//     minHeight: 200,
//   },
//   mediaHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingHorizontal: 4,
//   },
//   mediaCount: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   removeAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     backgroundColor: '#fff5f5',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ffe0e0',
//   },
//   removeAllText: {
//     color: '#ff4757',
//     fontSize: 12,
//     fontWeight: '500',
//     marginLeft: 4,
//   },
//   mediaGrid: {
//     flexWrap: 'wrap',
//   },
//   mediaItem: {
//     height: 120,
//     marginBottom: 8,
//     borderRadius: 8,
//     overflow: 'hidden',
//     position: 'relative',
//     backgroundColor: '#f0f0f0',
//   },
//   mediaImage: {
//     width: '100%',
//     height: '100%',
//   },
//   videoOverlay: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{translateX: -15}, {translateY: -15}],
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     borderRadius: 20,
//     padding: 4,
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 6,
//     right: 6,
//     backgroundColor: 'rgba(255, 71, 87, 0.9)',
//     borderRadius: 15,
//     width: 28,
//     height: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//   },
//   addMoreButton: {
//     width: '48%',
//     height: 80,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     marginTop: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderStyle: 'dashed',
//   },
//   addMoreText: {
//     color: '#666',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   layoutSection: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   sectionDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//   },
//   layoutOptions: {
//     flexDirection: 'row',
//     paddingHorizontal: 4,
//   },
//   layoutButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 8,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   selectedLayout: {
//     backgroundColor: '#2196F3',
//     borderColor: '#2196F3',
//   },
//   layoutText: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   selectedLayoutText: {
//     color: '#fff',
//   },
//   videoSettingsSection: {
//     marginBottom: 20,
//     backgroundColor: '#f8f9fa',
//     padding: 16,
//     borderRadius: 12,
//   },
//   settingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     marginBottom: 8,
//   },
//   settingInfo: {
//     flex: 1,
//     marginRight: 12,
//   },
//   settingTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//   },
//   settingDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 2,
//   },
//   thumbnailButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     marginTop: 8,
//   },
//   thumbnailButtonText: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#2196F3',
//     fontWeight: '500',
//   },
//   thumbnailPreview: {
//     marginTop: 12,
//   },
//   thumbnailPreviewTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 8,
//   },
//   thumbnailContainer: {
//     position: 'relative',
//     alignSelf: 'flex-start',
//   },
//   thumbnailImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//   },
//   removeThumbnail: {
//     position: 'absolute',
//     top: -6,
//     right: -6,
//     backgroundColor: '#ff4757',
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   uploadedStateInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#e3f2fd',
//     borderRadius: 8,
//     marginTop: 20,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2196F3',
//   },
//   uploadedStateText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#1565c0',
//     flex: 1,
//     fontWeight: '500',
//   },
//   doneButton: {
//     margin: 16,
//     backgroundColor: '#2196F3',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   doneButtonDisabled: {
//     backgroundColor: '#f0f0f0',
//   },
//   doneButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   doneButtonTextDisabled: {
//     color: '#999',
//   },
// });