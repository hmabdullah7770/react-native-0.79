import React from 'react';
import {View, StyleSheet} from 'react-native';

const LayoutOptionStyles = ({layoutId, size = 40}) => {
  const boxSize = size / 4;
  const spacing = 2;

  const renderLayout = () => {
    switch (layoutId) {
      case '1':
        return (
          <View style={[styles.container, {width: size, height: size}]}>
            <View style={[styles.box, {width: size - 4, height: size - 4}]} />
          </View>
        );

      case '2':
        return (
          <View style={[styles.container, {width: size, height: size}]}>
            <View style={[styles.box, {width: boxSize * 2 - spacing, height: size - 4}]} />
            <View style={[styles.box, {width: boxSize * 2 - spacing, height: size - 4, marginLeft: spacing}]} />
          </View>
        );

      case '2x2':
        return (
          <View style={[styles.container, {width: size, height: size}]}>
            <View style={styles.row}>
              <View style={[styles.box, {width: boxSize * 2 - spacing, height: boxSize * 2 - spacing}]} />
              <View style={[styles.box, {width: boxSize * 2 - spacing, height: boxSize * 2 - spacing, marginLeft: spacing}]} />
            </View>
            <View style={[styles.row, {marginTop: spacing}]}>
              <View style={[styles.box, {width: boxSize * 2 - spacing, height: boxSize * 2 - spacing}]} />
              <View style={[styles.box, {width: boxSize * 2 - spacing, height: boxSize * 2 - spacing, marginLeft: spacing}]} />
            </View>
          </View>
        );

      case '1x2':
        return (
          <View style={[styles.container, {width: size, height: size}]}>
            <View style={[styles.box, {width: boxSize * 3, height: boxSize * 2 - spacing}]} />
            <View style={styles.column}>
              <View style={[styles.box, {width: boxSize, height: boxSize - spacing / 2, marginLeft: spacing}]} />
              <View style={[styles.box, {width: boxSize, height: boxSize - spacing / 2, marginLeft: spacing, marginTop: spacing}]} />
            </View>
          </View>
        );

      case '1x3':
        return (
          <View style={[styles.container, {width: size, height: size}]}>
            <View style={[styles.box, {width: boxSize * 2.5, height: size - 4}]} />
            <View style={styles.column}>
              <View style={[styles.box, {width: boxSize * 1.3, height: boxSize - spacing, marginLeft: spacing}]} />
              <View style={[styles.box, {width: boxSize * 1.3, height: boxSize - spacing, marginLeft: spacing, marginTop: spacing}]} />
              <View style={[styles.box, {width: boxSize * 1.3, height: boxSize - spacing, marginLeft: spacing, marginTop: spacing}]} />
            </View>
          </View>
        );

      case 'carousel':
        return (
          <View style={[styles.container, {width: size, height: size}]}>
            <View style={[styles.box, {width: boxSize * 2.5, height: size - 4}]} />
            <View style={[styles.box, {width: boxSize * 2, height: size - 4, marginLeft: spacing, opacity: 0.6}]} />
            <View style={[styles.box, {width: boxSize * 1.5, height: size - 4, marginLeft: spacing, opacity: 0.3}]} />
          </View>
        );

      default:
        return (
          <View style={[styles.container, {width: size, height: size}]}>
            <View style={[styles.box, {width: size - 4, height: size - 4}]} />
          </View>
        );
    }
  };

  return renderLayout();
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 2,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  box: {
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
});

export default LayoutOptionStyles;