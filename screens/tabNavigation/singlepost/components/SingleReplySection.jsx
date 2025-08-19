import React, { useState, useCallback } from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { format } from 'date-fns'
import { useGetReplies, useAddReply } from '../../../ReactQuery/TanStackQueryHooks/useComments'

const ReplySection = ({ commentId, onReplyAdded }) => {
  const [replyText, setReplyText] = useState('')
  const [showReplies, setShowReplies] = useState(false)
  const { mutate: addReply, isLoading: isAddingReply } = useAddReply()
  const { 
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetReplies(commentId, 10)

  const replies = data?.pages?.flatMap(page => page.data) || []
  const hasReplies = replies.length > 0

  const handleAddReply = () => {
    if (!replyText.trim()) return
    addReply(
      {
        commentId,
        content: replyText
      },
      {
        onSuccess: () => {
          setReplyText('')
          onReplyAdded?.()
          setShowReplies(true)
        }
      }
    )
  }

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const renderReply = useCallback(({ item }) => (
    <View style={styles.replyItem}>
      <Image source={{ uri: item.user.avatar }} style={styles.replyAvatar} />
      <View style={styles.replyContent}>
        <Text style={styles.username}>{item.user.username}</Text>
        <Text style={styles.replyText}>{item.content}</Text>
        <Text style={styles.timestamp}>
          {format(new Date(item.createdAt), 'MMM dd, yyyy')}
        </Text>
      </View>
    </View>
  ), [])

  return (
    <View style={styles.replySection}>
      {hasReplies && (
        <TouchableOpacity 
          style={styles.showRepliesButton}
          onPress={() => setShowReplies(!showReplies)}
        >
          <Icon 
            name={showReplies ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color="#666" 
          />
          <Text style={styles.showRepliesText}>
            {showReplies ? 'Hide' : 'Show'} {replies.length} replies
          </Text>
        </TouchableOpacity>
      )}

      {showReplies && (
        <FlatList
          data={replies}
          renderItem={renderReply}
          keyExtractor={item => item._id}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage && 
            <ActivityIndicator size="small" color="#007AFF" />
          }
        />
      )}

      <View style={styles.replyInputContainer}>
        <TextInput
          style={styles.replyInput}
          placeholder="Add a reply..."
          value={replyText}
          onChangeText={setReplyText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.replyButton,
            isAddingReply && styles.replyButtonDisabled
          ]}
          onPress={handleAddReply}
          disabled={isAddingReply || !replyText.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={isAddingReply ? '#ccc' : '#007AFF'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  replySection: {
    marginTop: 8,
    marginLeft: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 8,
  },
  replyItem: {
    flexDirection: 'row',
    marginVertical: 8,
    marginLeft: 20,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    fontSize: 13,
    backgroundColor: '#fff',
    maxHeight: 80,
  },
  replyButton: {
    padding: 8,
    borderRadius: 16,
  },
  replyButtonDisabled: {
    opacity: 0.5,
  },
  showRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  showRepliesText: {
    color: '#666',
    fontSize: 13,
    marginLeft: 4,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
  }
})

export default ReplySection