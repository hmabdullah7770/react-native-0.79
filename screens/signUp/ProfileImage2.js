import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NextButton from './components/NextButton';

const ProfileImage2 = ({ route, navigation }) => {
  // Get params from previous screen
  const { email, username, password, otp } = route?.params || {};
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState('');

  // Image picker handler
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
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
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
        image, // contains uri, fileName, type, etc.
        bio,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Picture</Text>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="person" size={80} color="#dddddd" />
          </View>
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleImagePicker}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.bioInput}
        placeholder="Write your bio..."
        value={bio}
        onChangeText={setBio}
        multiline
        maxLength={200}
      />
      <NextButton onPress={handleNext} disabled={isButtonDisabled} />
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
  bioInput: {
    width: '100%',
    minHeight: 60,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
});