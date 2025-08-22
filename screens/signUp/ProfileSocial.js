import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  Image, TextInput, Alert, Modal, ScrollView
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { signuprequest } from '../../Redux/action/auth';
import SocialModal from './SocialModal';
import SocialBox from './SocialBox';

const ProfileSocial = ({ route, navigation }) => {
  const { email, username, password, otp } = route?.params || {};
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);

  // Profile states
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState('');

  // Camera states
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [tempImage, setTempImage] = useState(null);

  const devices = useCameraDevices();
  const device = devices.back;

  // Social states
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    whatsapp: false, facebook: false, instagram: false, storelink: false
  });
  const [platformData, setPlatformData] = useState({
    whatsapp: '', facebook: '', instagram: '', storelink: ''
  });
  const [platformErrors, setPlatformErrors] = useState({});
  const [socialModalVisible, setSocialModalVisible] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState(null);

  useEffect(() => { checkCameraPermission(); }, []);

  const checkCameraPermission = async () => {
    const permission = await Camera.getCameraPermissionStatus();
    setCameraPermission(permission);
    if (permission === 'not-determined') {
      const newPermission = await Camera.requestCameraPermission();
      setCameraPermission(newPermission);
    }
  };

  const handlePlusPress = () => {
    if (image) {
      Alert.alert("Remove Image", "Do you want to remove this picture?", [
        { text: "Cancel" }, { text: "Remove", onPress: () => setImage(null) }
      ]);
    } else {
      setShowModal(true);
    }
  };

  const handleImagePicker = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets?.length > 0) setImage(result.assets[0]);
  };

  const handleCameraOption = () => {
    setShowModal(false);
    if (cameraPermission === 'authorized') setShowCamera(true);
    else Alert.alert("Permission Required", "Camera permission is required");
  };

  const handleCameraCapture = async (camera) => {
    const photo = await camera.takePhoto({ qualityPrioritization: 'speed' });
    const imageData = { uri: `file://${photo.path}`, fileName: `camera_${Date.now()}.jpg`, type: 'image/jpeg' };
    setTempImage(imageData);
    setShowCamera(false);
  };

  const handleApplyImage = () => { setImage(tempImage); setTempImage(null); };

  // Social handling
  const platformLabels = {
    whatsapp: 'WhatsApp Number',
    facebook: 'Facebook Profile',
    instagram: 'Instagram Profile',
    storelink: 'Store Website'
  };

  const validatePlatform = (platform, value) => {
    switch (platform) {
      case 'facebook': return /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+$/.test(value) ? '' : 'Invalid Facebook link';
      case 'instagram': return /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.-]+$/.test(value) ? '' : 'Invalid Instagram link';
      case 'whatsapp': return /^\d{10,15}$/.test(value) ? '' : 'Invalid WhatsApp number';
      case 'storelink': return /^https?:\/\/.+\..+/.test(value) ? '' : 'Invalid store link';
      default: return '';
    }
  };

  const handleBoxPress = (platform) => { setCurrentPlatform(platform); setSocialModalVisible(true); };

  const handleSaveData = (platform, value) => {
    const errorMsg = validatePlatform(platform, value);
    setPlatformErrors(prev => ({ ...prev, [platform]: errorMsg }));
    setPlatformData(prev => ({ ...prev, [platform]: value }));
    setSelectedPlatforms(prev => ({ ...prev, [platform]: value.trim() !== '' }));
    setSocialModalVisible(false);
  };

  // Enable final submit
  const isSubmitEnabled =
    image && bio.trim() &&
    Object.values(selectedPlatforms).some(Boolean) &&
    Object.entries(selectedPlatforms).every(([p, selected]) =>
      !selected || (selected && !platformErrors[p] && platformData[p])
    );

  const handleSignup = () => {
    const socialLinks = {};
    Object.keys(selectedPlatforms).forEach(p => { if (selectedPlatforms[p]) socialLinks[p] = platformData[p]; });
    dispatch(signuprequest(username, password, email, image, otp,
      socialLinks.whatsapp, socialLinks.facebook, socialLinks.instagram, socialLinks.storelink, bio));
  };

  // Camera UI
  if (showCamera && device) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Camera style={{ flex: 1 }} device={device} isActive photo />
        <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.captureButton}>
          <Text style={{ color: '#fff' }}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Profile</Text>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        {(tempImage || image)
          ? <Image source={{ uri: tempImage?.uri || image?.uri }} style={styles.profileImage} />
          : <View style={styles.imagePlaceholder}><Icon name="person" size={80} color="#ccc" /></View>}
        <TouchableOpacity style={styles.addButton} onPress={handlePlusPress}>
          <Icon name={image ? "delete" : "add"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {tempImage && (
        <TouchableOpacity onPress={handleApplyImage} style={styles.applyButton}>
          <Text style={{ color: '#fff' }}>Apply</Text>
        </TouchableOpacity>
      )}

      {/* Bio */}
      <TextInput
        style={styles.bioInput}
        placeholder="Write your bio..."
        value={bio}
        onChangeText={setBio}
        multiline
      />

      {/* Social Links */}
      <View style={styles.boxesContainer}>
        {Object.keys(platformLabels).map((p) => (
          <View key={p} style={{ width: '48%' }}>
            <SocialBox
              platform={p}
              label={platformLabels[p]}
              value={platformData[p]}
              isSelected={selectedPlatforms[p]}
              onPress={() => handleBoxPress(p)}
            />
            {platformErrors[p] ? <Text style={styles.errorText}>{platformErrors[p]}</Text> : null}
          </View>
        ))}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.nextButton, !isSubmitEnabled && styles.disabledButton]}
        disabled={!isSubmitEnabled || isLoading}
        onPress={handleSignup}
      >
        <Text style={styles.nextButtonText}>{isLoading ? 'Signing Up...' : 'Finish Signup'}</Text>
      </TouchableOpacity>

      {/* Modals */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleCameraOption}><Text>Camera</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker}><Text>Gallery</Text></TouchableOpacity>
        </View>
      </Modal>

      <SocialModal
        visible={socialModalVisible}
        platform={currentPlatform}
        platformLabel={currentPlatform ? platformLabels[currentPlatform] : ''}
        initialValue={currentPlatform ? platformData[currentPlatform] : ''}
        onSave={(val) => handleSaveData(currentPlatform, val)}
        onClose={() => setSocialModalVisible(false)}
      />
    </ScrollView>
  );
};

export default ProfileSocial;

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  imageContainer: { width: 140, height: 140, borderRadius: 70, marginBottom: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' },
  profileImage: { width: 140, height: 140, borderRadius: 70 },
  imagePlaceholder: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center' },
  addButton: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#f9213f', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  applyButton: { marginBottom: 10, padding: 10, backgroundColor: '#4CAF50', borderRadius: 8 },
  bioInput: { width: '100%', minHeight: 60, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginBottom: 20 },
  boxesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  nextButton: { backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 8, alignItems: 'center', width: '100%' },
  disabledButton: { backgroundColor: '#ccc' },
  nextButtonText: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 }
});
