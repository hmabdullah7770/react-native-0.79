import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

const CardBottomBar = ({ item }) => {
 






  const handleSocialPress = (link) => {
    // Handle opening the social media link/number
    console.log('Opening link:', link)
    // You can add Linking.openURL(link) here to actually open the links
  }

  // Only render sidebar if there are social icons
  if (socialIcons.length === 0) {
    return null;
  }

  return (
    <View style={styles.sidebar}>
      {/* {socialIcons.map((icon, index) => ( */}
        <TouchableOpacity 
          
          style={styles.iconButton} 
          activeOpacity={0.7}
          onPress={() => handleSocialPress(icon.link)}
        >
          <Icon name={like} size={28} color='rgb(2, 222, 134)' />
        </TouchableOpacity>

        <TouchableOpacity 
          
          style={styles.iconButton} 
          activeOpacity={0.7}
          onPress={() => handleSocialPress(icon.link)}
        >
          <Icon name={comment} size={28} color='rgb(2, 222, 134)' />
        </TouchableOpacity>


        <TouchableOpacity 
          
          style={styles.iconButton} 
          activeOpacity={0.7}
          onPress={() => handleSocialPress(icon.link)}
        >
          <Icon name={share} size={28} color='rgb(2, 222, 134)' />

        </TouchableOpacity>


        <TouchableOpacity 
          
          style={styles.iconButton} 
          activeOpacity={0.7}
          onPress={() => handleSocialPress(icon.link)}
        >
          <Icon name={rating} size={28} color='rgb(2, 222, 134)' />
        </TouchableOpacity>
      {/* ))} */}
    </View>
  )
}

export default CardBottomBar 

const styles = StyleSheet.create({
  sidebar: {
    width: 40,
    height: 200, // Match the image height
    alignItems: 'center',
    paddingVertical: 14,
    justifyContent: 'center',
    borderColor: 'rgb(2, 222, 134)',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconButton: {
    marginVertical: 8, 
  },
})