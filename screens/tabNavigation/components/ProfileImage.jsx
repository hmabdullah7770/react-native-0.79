import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MMKV } from 'react-native-mmkv';

// Create MMKV instance
const storage = new MMKV();

const ProfileImage = () => {
  const user = useSelector(state => state.auth); // Get from Redux
  const profileImageFromRedux = user?.data?.data?.profileImage;

  const [profileImage, setProfileImage] = useState<string | null>(null);

  // ✅ Store to MMKV (only when Redux has value)
  useEffect(() => {
    if (profileImageFromRedux) {
      storage.set('profileImage', profileImageFromRedux); // Save to MMKV
    }
    // Always get from MMKV
    const imageFromStorage = storage.getString('profileImage');
    setProfileImage(imageFromStorage ?? null);
  }, [profileImageFromRedux]);

  return (
    <View style={styles.container}>
      {profileImage ? (
        <Image
          source={{ uri: profileImage }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
      ) : (
        <Text>No Image Found</Text>
      )}
      <Text>ProfileImage</Text>
    </View>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
});
