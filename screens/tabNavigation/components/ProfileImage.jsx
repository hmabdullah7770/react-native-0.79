import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
 import AsyncStorage from '@react-native-async-storage/async-storage'


const ProfileImage = () => {

const user = useSelector((state) => state.auth.user.data);

  return (
    <View>
      <Image source={{uri:user?.data?.data?.profileImage}} style={{width:50,height:50,borderRadius:50}}/>
      <Text>ProfileImage</Text>
    </View>
  )
}

export default ProfileImage

const styles = StyleSheet.create({})