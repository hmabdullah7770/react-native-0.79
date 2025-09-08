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

const ImageGrid = ({visible, onClose}) => {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState('1'); // Default layout
  const [videoSettings, setVideoSettings] = useState({
    autoPlay: true,
    thumbnail: null,
  });
  const [showVideoSettings, setShowVideoSettings] = useState(false);

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
      
      // Show video settings if any video is uploaded
      const hasVideo = newMedia.some(media => media.isVideo);
      if (hasVideo) {
        setShowVideoSettings(true);
      }
    });
  };

  const handleRemoveMedia = index => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
    
    // Hide video settings if no videos remaining
    const hasVideo = selectedMedia.filter((_, i) => i !== index).some(media => media.isVideo);
    if (!hasVideo) {
      setShowVideoSettings(false);
    }
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
        </TouchableOpacity>
      );
    }

    const cols = selectedLayout === 'carousel' ? 1 : 
                 layoutOptions.find(l => l.id === selectedLayout)?.cols || 1;

    return (
      <View style={styles.mediaContainer}>
        <View style={[styles.mediaGrid, {flexDirection: cols === 1 ? 'column' : 'row'}]}>
          {selectedMedia.map((media, index) => (
            <View
              key={index}
              style={[
                styles.mediaItem,
                {
                  width: cols === 1 ? '100%' : cols === 2 ? '48%' : '31%',
                  marginRight: cols > 1 ? '2%' : 0,
                },
              ]}>
              <Image source={{uri: media.uri}} style={styles.mediaImage} />
              {media.isVideo && (
                <View style={styles.videoOverlay}>
                  <Icon name="play-circle-filled" size={30} color="rgba(255,255,255,0.8)" />
                </View>
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMedia(index)}>
                <Icon name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addMoreButton} onPress={handleMediaUpload}>
            <Icon name="add" size={24} color="#666" />
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

        <ScrollView style={styles.content}>
          {/* Media Grid */}
          <View style={styles.gridContainer}>
            {renderMediaGrid()}
          </View>

          {/* Layout Options */}
          <View style={styles.layoutSection}>
            <Text style={styles.sectionTitle}>Layout Style</Text>
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

          {/* Video Settings */}
          {showVideoSettings && (
            <View style={styles.videoSettingsSection}>
              <Text style={styles.sectionTitle}>Video Settings</Text>
              
              {/* Auto Play */}
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto Play</Text>
                  <Text style={styles.settingDescription}>
                    Videos will play automatically
                  </Text>
                </View>
                <Switch
                  value={videoSettings.autoPlay}
                  onValueChange={value =>
                    setVideoSettings(prev => ({...prev, autoPlay: value}))
                  }
                />
              </View>

              {/* Thumbnail Upload */}
              <TouchableOpacity
                style={styles.thumbnailButton}
                onPress={handleThumbnailUpload}>
                <Icon name="photo" size={20} color="#2196F3" />
                <Text style={styles.thumbnailButtonText}>
                  {videoSettings.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                </Text>
              </TouchableOpacity>

              {videoSettings.thumbnail && (
                <View style={styles.thumbnailPreview}>
                  <Image
                    source={{uri: videoSettings.thumbnail.uri}}
                    style={styles.thumbnailImage}
                  />
                  <TouchableOpacity
                    style={styles.removeThumbnail}
                    onPress={() =>
                      setVideoSettings(prev => ({...prev, thumbnail: null}))
                    }>
                    <Icon name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
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
    color: '#666',
    fontSize: 16,
  },
  mediaContainer: {
    minHeight: 200,
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
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreButton: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  layoutSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  doneButton: {
    margin: 16,
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  alignItems: 'center',
  },
  doneButton: {
    margin: 16,
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageGrid;