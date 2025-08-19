
import React, { useCallback, useState } from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import Icon from 'react-native-vector-icons/Ionicons'
import { format } from 'date-fns'
import { usegetComments, useAddComment } from '../../../ReactQuery/TanStackQueryHooks/useComments'
import ReplySection from './ReplySection'

const CommentItem = ({ item }) => {
  const [isReplying, setIsReplying] = useState(false)

  return (
    <View style={styles.commentItem}>
      <Image 
        source={{ uri: item.user.avatar }} 
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.username}>{item.user.username}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <View style={styles.commentActions}>
          <Text style={styles.timestamp}>
            {format(new Date(item.createdAt), 'MMM dd, yyyy')}
          </Text>
          <TouchableOpacity onPress={() => setIsReplying(!isReplying)}>
            <Text style={styles.replyButtonText}>
              {isReplying ? 'Cancel' : 'Reply'}
            </Text>
          </TouchableOpacity>
        </View>
        {isReplying && (
          <ReplySection 
            commentId={item._id} 
            onReplyAdded={() => setIsReplying(false)}
          />
        )}
      </View>
    </View>
  )
}

const Comments = ({ sheetRef, contentId, contentType }) => {
  const [commentText, setCommentText] = useState('')
  const { mutate: addComment, isLoading: isAddingComment } = useAddComment()
  
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usegetComments(10, contentId, contentType)

  const comments = data?.pages?.flatMap(page => page.data) || []

  const handleAddComment = () => {
    if (!commentText.trim()) return

    addComment(
      {
        content: commentText,
        // audioComment,
        // videoComment,
        // sticker,
       
        postId,
        // contentType
      },
      {
        onSuccess: () => {
          setCommentText('')
        }
      }
    )
  }

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const renderComment = useCallback(({ item }) => (
    <CommentItem item={item} />
  ), [])

  return (
    <RBSheet
      ref={sheetRef}
      height={500}
      openDuration={250}
      closeOnDragDown
      customStyles={{
        container: styles.sheetContainer,
        draggableIcon: styles.draggableIcon
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <Text style={styles.commentCount}>
            {comments.length > 0 ? `${comments.length} comments` : ''}
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={item => item._id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No comments yet</Text>
            }
            ListFooterComponent={
              isFetchingNextPage && 
              <ActivityIndicator size="small" color="#007AFF" />
            }
            contentContainerStyle={styles.commentsList}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            multiline
            value={commentText}
            onChangeText={setCommentText}
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              isAddingComment && styles.sendButtonDisabled
            ]}
            onPress={handleAddComment}
            disabled={isAddingComment || !commentText.trim()}
          >
            <Icon 
              name="send" 
              size={24} 
              color={isAddingComment ? '#ccc' : '#007AFF'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  )
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  draggableIcon: {
    backgroundColor: '#000',
    width: 35,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentCount: {
    color: '#666',
    fontSize: 14,
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  replyButtonText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 14,
  }
})

export default Comments

// import React, { useCallback ,useState} from 'react'
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   FlatList, 
//   TextInput, 
//   TouchableOpacity,
//   ActivityIndicator
// } from 'react-native'
// import RBSheet from 'react-native-raw-bottom-sheet'
// import { usegetComments } from '../../../ReactQuery/TanStackQueryHooks/useComments'

// const Comments = ({ sheetRef, contentId, contentType }) => {


//   const [commentText, setCommentText] = useState('')
//   const { mutate: addComment, isLoading: isAddingComment } = useAddComment()
  
//   // ...existing query code...

//   const handleAddComment = () => {
//     if (!commentText.trim()) return;

//     addComment(
//       {
//         content: commentText,
//         contentId,
//         contentType
//       },
//       {
//         onSuccess: () => {
//           setCommentText('') // Clear input on success
//         }
//       }
//     )
//   }




//   const {
//     data,
//     isLoading,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage
//   } = usegetComments(10, contentId, contentType)

//   const comments = data?.pages?.flatMap(page => page.data) || []

//   const renderComment = useCallback(({ item }) => (
//     <View style={styles.commentItem}>
//       <Image 
//         source={{ uri: item.user.avatar }} 
//         style={styles.avatar}
//       />
//       <View style={styles.commentContent}>
//         <Text style={styles.username}>{item.user.username}</Text>
//         <Text style={styles.commentText}>{item.text}</Text>
//         <Text style={styles.timestamp}>
//           {format(new Date(item.createdAt), 'MMM dd, yyyy')}
//         </Text>
//       </View>
//     </View>
//   ), [])

//   const loadMore = () => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage()
//     }
//   }

//   return (
//     <RBSheet
//       ref={sheetRef}
//       height={500}
//       openDuration={250}
//       closeOnDragDown
//       customStyles={{
//         container: styles.sheetContainer,
//         draggableIcon: styles.draggableIcon
//       }}
//     >
//       <View style={styles.container}>
//         <Text style={styles.title}>Comments</Text>

//         {isLoading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : (
//           <FlatList
//             data={comments}
//             renderItem={renderComment}
//             keyExtractor={item => item._id}
//             onEndReached={loadMore}
//             onEndReachedThreshold={0.5}
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No comments yet</Text>
//             }
//             ListFooterComponent={
//               isFetchingNextPage && 
//               <ActivityIndicator size="small" color="#0000ff" />
//             }
//           />
//         )}

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Add a comment..."
//             multiline

             
//             value={commentText}
//             onChangeText={setCommentText}
//           />
//                    <TouchableOpacity 
//             style={[
//               styles.sendButton,
//               isAddingComment && styles.sendButtonDisabled
//             ]}
//             onPress={handleAddComment}
//             disabled={isAddingComment || !commentText.trim()}
//           >
//             <Icon name="send" size={24} color="#007AFF" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </RBSheet>
//   )
// }

// const styles = StyleSheet.create({
  
//    sendButtonDisabled: {
//     opacity: 0.5
//   },
//   sheetContainer: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   draggableIcon: {
//     backgroundColor: '#000',
//     width: 35,
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   commentItem: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   commentContent: {
//     flex: 1,
//   },
//   username: {
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   commentText: {
//     marginBottom: 4,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: '#666',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     alignItems: 'center',
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 8,
//   },
//   sendButton: {
//     padding: 8,
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: '#666',
//     marginTop: 20,
//   }
// })

// export default Comments