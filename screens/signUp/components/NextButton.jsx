import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'

const NextButton = ({ onPress, disabled }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.button,
          disabled && { backgroundColor: '#ccc' } // light color when disabled
        ]}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text style={[
          styles.buttonText,
          disabled && { color: '#888' } // dim text when disabled
        ]}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default NextButton

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#f9213f',
    padding: 10,
    borderRadius: 10,
    width: 90,
    alignItems: 'center',
    elevation: 2, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
})