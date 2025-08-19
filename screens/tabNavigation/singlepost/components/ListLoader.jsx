import {StyleSheet,  View, ActivityIndicator} from 'react-native';
import React from 'react';

const ListLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={'blue'} />
    </View>
  );
};

export default ListLoader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    
    zIndex: 999,
  },
});
