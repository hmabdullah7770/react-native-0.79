import { StyleSheet, View } from 'react-native'
import React from 'react'
import CategouryList from './components/CategouryList'
import Feed from './components/Feed'

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <CategouryList/>
      </View>
      <View style={styles.feedContainer}>
        <Feed/>
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  categoryContainer: {
    zIndex: 1
  },
  feedContainer: {
    flex: 1
  }
})