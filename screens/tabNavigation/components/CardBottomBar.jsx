import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const CardBottomBar = ({ item }) => {
  const [isLiked, setIsLiked] = useState(false);
  const commentsSheetRef = useRef(null);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add your like logic here
  };

  const handleComment = () => {
    // Add your comment logic here
    // You can open a modal or navigate to comments screen
    console.log('Comment pressed');
    // If you have a comments modal/sheet, you can open it here
    // commentsSheetRef.current?.open();
  };

  const handleShare = () => {
    // Add your share logic here
    console.log('Share pressed');
  };

  const handleRating = () => {
    // Add your rating logic here
    console.log('Rating pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.iconButton} 
        activeOpacity={0.7}
        onPress={handleLike}
      >
        <Icon 
          name={isLiked ? 'heart' : 'heart-outline'} 
          size={24} 
          color={isLiked ? '#e74c3c' : '#666'} 
        />
        <Text style={styles.iconText}>{item?.likes || 0}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconButton} 
        activeOpacity={0.7}
        onPress={handleComment}
      >
        <Icon name="chatbubble-outline" size={24} color="#666" />
        <Text style={styles.iconText}>{item?.comments || 0}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconButton} 
        activeOpacity={0.7}
        onPress={handleShare}
      >
        <Icon name="share-social-outline" size={24} color="#666" />
        <Text style={styles.iconText}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconButton} 
        activeOpacity={0.7}
        onPress={handleRating}
      >
        <Icon name="star-outline" size={24} color="#666" />
        <Text style={styles.iconText}>{item?.rating || 0}</Text>
      </TouchableOpacity>

      {/* 
      If you want to add Comments component back, make sure to import it properly:
      <Comments 
        sheetRef={commentsSheetRef}
        contentId={item._id}
        contentType={item.contentType}
      />
      */}
    </View>
  );
};

export default CardBottomBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  }
});




// import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
// import React, { useState } from 'react'
// import Icon from 'react-native-vector-icons/Ionicons'

// const CardBottomBar = ({ item }) => {
//   const [isLiked, setIsLiked] = useState(false)
  
//   const handleLike = () => {
//     setIsLiked(!isLiked)
//     // Add your like logic here
//   }

//   const handleComment = () => {
//     // Add your comment logic here
//     console.log('Comment pressed')
//   }

//   const handleShare = () => {
//     // Add your share logic here
//     console.log('Share pressed')
//   }

//   const handleRating = () => {
//     // Add your rating logic here
//     console.log('Rating pressed')
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity 
//         style={styles.iconButton} 
//         activeOpacity={0.7}
//         onPress={handleLike}
//       >
//         <Icon 
//           name={isLiked ? 'heart' : 'heart-outline'} 
//           size={24} 
//           color={isLiked ? '#e74c3c' : '#666'} 
//         />
//         <Text style={styles.iconText}>{item?.likes || 0}</Text>
//       </TouchableOpacity>

//       {/* <TouchableOpacity 
//         style={styles.iconButton} 
//         activeOpacity={0.7}
//         onPress={handleComment}
//       >
//         <Icon name="chatbubble-outline" size={24} color="#666" />
//         <Text style={styles.iconText}>{item?.comments || 0}</Text>
//       </TouchableOpacity> */}

//  <TouchableOpacity 
//         style={styles.iconButton} 
//         activeOpacity={0.7}
//         onPress={handleComment}
//       >
//         <Icon name="chatbubble-outline" size={24} color="#666" />
//         <Text style={styles.iconText}>{item?.comments || 0}</Text>
//       </TouchableOpacity>

//       {/* ... other buttons ... */}

//       <Comments 
//         sheetRef={commentsSheetRef}
//         contentId={item._id}
//         contentType={item.contentType}
//       />
      

//       <TouchableOpacity 
//         style={styles.iconButton} 
//         activeOpacity={0.7}
//         onPress={handleShare}
//       >
//         <Icon name="share-social-outline" size={24} color="#666" />
//         <Text style={styles.iconText}>Share</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={styles.iconButton} 
//         activeOpacity={0.7}
//         onPress={handleRating}
//       >
//         <Icon name="star-outline" size={24} color="#666" />
//         <Text style={styles.iconText}>{item?.rating || 0}</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default CardBottomBar 

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   iconButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 8,
//   },
//   iconText: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   }
// })