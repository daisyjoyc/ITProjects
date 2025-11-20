import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  getAllPosts,
  createPost,
  deletePost,
  addComment,
  getCommentsByPostId,
  deleteComment,
  getUserWithProfilePic,
  addPostReaction,
  removePostReaction,
  getPostReactions,
  getUserReactionForPost,
  createStory,
  getAllStories,
  deleteOldStories,
} from './database';
import db from './database';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');

export default function FeedScreen({ route, navigation }) {
  const { currentUser } = route.params;
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [postReactions, setPostReactions] = useState({});
  const { theme, isDark } = useTheme();

  const reactions = ['❤️', '😂', '😮', '😢', '😍', '🔥'];

  useEffect(() => {
    loadPosts();
    loadStories();
    deleteOldStories();
    
    const interval = setInterval(() => {
      loadPosts();
      loadStories();
      deleteOldStories();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadPosts = () => {
    const allPosts = getAllPosts();
    setPosts(allPosts);
    
    // Load reactions for all posts
    const reactionsData = {};
    allPosts.forEach(post => {
      const reactions = getPostReactions(post.id);
      reactionsData[post.id] = reactions;
    });
    setPostReactions(reactionsData);
  };

  const loadStories = () => {
    const allStories = getAllStories();
    
    // Group stories by user
    const groupedStories = {};
    allStories.forEach(story => {
      if (!groupedStories[story.username]) {
        groupedStories[story.username] = [];
      }
      groupedStories[story.username].push(story);
    });
    
    // Convert to array with latest story per user
    const storiesArray = Object.keys(groupedStories).map(username => ({
      username,
      stories: groupedStories[username],
      latestStory: groupedStories[username][0],
    }));
    
    setStories(storiesArray);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setModalVisible(true);
    }
  };

  const pickStoryImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.7,
    });

    if (!result.canceled) {
      const createResult = createStory(currentUser, result.assets[0].uri);
      if (createResult.success) {
        Alert.alert('Success', 'Story added!');
        loadStories();
      }
    }
  };

  const handleCreatePost = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    const result = createPost(currentUser, selectedImage, caption);

    if (result.success) {
      Alert.alert('Success', 'Post created!');
      setModalVisible(false);
      setSelectedImage(null);
      setCaption('');
      loadPosts();
    } else {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handleDeletePost = (postId, postUsername) => {
    if (postUsername !== currentUser) {
      Alert.alert('Error', 'You can only delete your own posts');
      return;
    }

    Alert.alert('Delete Post', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const result = deletePost(postId);
          if (result.success) {
            Alert.alert('Success', 'Post deleted');
            loadPosts();
          }
        },
      },
    ]);
  };

  const handleReaction = (postId, reaction) => {
    const userReaction = getUserReactionForPost(postId, currentUser);
    
    if (userReaction && userReaction.reaction === reaction) {
      // Remove reaction if same
      removePostReaction(postId, currentUser);
    } else {
      // Add or update reaction
      addPostReaction(postId, currentUser, reaction);
    }
    
    loadPosts();
  };

  const openComments = (post) => {
    setSelectedPost(post);
    loadComments(post.id);
    setCommentModalVisible(true);
  };

  const loadComments = (postId) => {
    const postComments = getCommentsByPostId(postId);
    setComments(postComments);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      return;
    }

    const result = addComment(selectedPost.id, currentUser, newComment.trim());

    if (result.success) {
      setNewComment('');
      loadComments(selectedPost.id);
    }
  };

  const handleDeleteComment = (commentId, commentUsername) => {
    if (commentUsername !== currentUser) {
      Alert.alert('Error', 'You can only delete your own comments');
      return;
    }

    Alert.alert('Delete Comment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const result = deleteComment(commentId);
          if (result.success) {
            loadComments(selectedPost.id);
          }
        },
      },
    ]);
  };

  const openStory = (storyData) => {
    setSelectedStory(storyData);
    setStoryModalVisible(true);
  };

  const getProfileImage = (username) => {
    const userData = getUserWithProfilePic(username);
    if (userData?.profile_pic && userData.profile_pic.startsWith('file://')) {
      return { uri: userData.profile_pic };
    }
    return require('./assets/adaptive-icon.png');
  };

  const getReactionCounts = (postId) => {
    const reactions = postReactions[postId] || [];
    const counts = {};
    reactions.forEach(r => {
      counts[r.reaction] = (counts[r.reaction] || 0) + 1;
    });
    return counts;
  };

  const getUserReaction = (postId) => {
    const reaction = getUserReactionForPost(postId, currentUser);
    return reaction?.reaction || null;
  };

  const renderStory = ({ item }) => (
    <TouchableOpacity
      style={styles.storyContainer}
      onPress={() => openStory(item)}
    >
      <LinearGradient
        colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
        style={styles.storyGradientBorder}
      >
        <View style={[styles.storyInner, { backgroundColor: theme.background }]}>
          <Image
            source={getProfileImage(item.username)}
            style={styles.storyImage}
          />
        </View>
      </LinearGradient>
      <Text style={[styles.storyUsername, { color: theme.text }]} numberOfLines={1}>
        {item.username === currentUser ? 'You' : item.username}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }) => {
    const reactionCounts = getReactionCounts(item.id);
    const userReaction = getUserReaction(item.id);
    const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

    return (
      <View style={[styles.postCard, { backgroundColor: theme.cardBackground }]}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image source={getProfileImage(item.username)} style={styles.postAvatar} />
          <View style={styles.postHeaderText}>
            <Text style={[styles.postUsername, { color: theme.text }]}>
              {item.username}
            </Text>
            <Text style={[styles.postTime, { color: theme.secondaryText }]}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
          {item.username === currentUser && (
            <TouchableOpacity onPress={() => handleDeletePost(item.id, item.username)}>
              <Text style={styles.deleteButton}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Post Image */}
        <Image source={{ uri: item.image_uri }} style={styles.postImage} />

        {/* Reactions Bar */}
        <View style={[styles.reactionsBar, { borderBottomColor: theme.border }]}>
          <View style={styles.reactionButtons}>
            {reactions.map((reaction) => (
              <TouchableOpacity
                key={reaction}
                style={[
                  styles.reactionBtn,
                  userReaction === reaction && styles.reactionBtnActive,
                ]}
                onPress={() => handleReaction(item.id, reaction)}
              >
                <Text style={styles.reactionEmoji}>{reaction}</Text>
                {reactionCounts[reaction] && (
                  <Text style={[styles.reactionCount, { color: theme.secondaryText }]}>
                    {reactionCounts[reaction]}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {totalReactions > 0 && (
            <Text style={[styles.totalReactions, { color: theme.secondaryText }]}>
              {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
            </Text>
          )}
        </View>

        {/* Post Caption */}
        {item.caption ? (
          <View style={styles.captionContainer}>
            <Text style={[styles.captionUsername, { color: theme.text }]}>
              {item.username}
            </Text>
            <Text style={[styles.postCaption, { color: theme.text }]}> {item.caption}</Text>
          </View>
        ) : null}

        {/* Comment Button */}
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => openComments(item)}
        >
          <Text style={[styles.commentButtonText, { color: theme.primary }]}>
            💬 View Comments
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Image source={getProfileImage(item.username)} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={[styles.commentUsername, { color: theme.text }]}>
          {item.username}
        </Text>
        <Text style={[styles.commentText, { color: theme.text }]}>{item.comment}</Text>
        <Text style={[styles.commentTime, { color: theme.secondaryText }]}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      {item.username === currentUser && (
        <TouchableOpacity onPress={() => handleDeleteComment(item.id, item.username)}>
          <Text style={[styles.deleteCommentButton, { color: theme.error }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDark ? ['#2193b0', '#6dd5ed'] : ['#fff1eb', '#ace0f9', '#ffecd2', '#e0c3fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Decorative Shapes */}
        <View style={[styles.decorShape, styles.shape1, { backgroundColor: isDark ? 'rgba(109,213,237,0.15)' : 'rgba(255,182,193,0.35)' }]} />
        <View style={[styles.decorShape, styles.shape2, { backgroundColor: isDark ? 'rgba(109,213,237,0.12)' : 'rgba(224,195,252,0.3)' }]} />
        <View style={[styles.decorShape, styles.shape3, { backgroundColor: isDark ? 'rgba(109,213,237,0.1)' : 'rgba(172,224,249,0.35)' }]} />
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#1C1C1E', '#000000'] : ['#FFFFFF', '#F8F9FA']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.backButtonGradient}
          >
            <Text style={styles.backButton}>x</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Feed</Text>
        <TouchableOpacity style={[styles.createButton, { backgroundColor: theme.primary }]} onPress={pickImage}>
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Stories Section */}
      <View style={styles.storiesSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Stories</Text>
        <View style={styles.storiesContainer}>
          {/* Add Story Button */}
          <TouchableOpacity style={styles.addStoryContainer} onPress={pickStoryImage}>
            <LinearGradient
              colors={[theme.primary, theme.primaryLight]}
              style={styles.addStoryGradient}
            >
              <Text style={styles.addStoryIcon}>+</Text>
            </LinearGradient>
            <Text style={[styles.storyUsername, { color: theme.text }]}>Add Story</Text>
          </TouchableOpacity>

          {/* Stories List */}
          <FlatList
            data={stories}
            renderItem={renderStory}
            keyExtractor={(item) => item.username}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storiesList}
          />
        </View>
      </View>

      {/* Posts List */}
      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📸</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>No posts yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.secondaryText }]}>
            Be the first to create a post!
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.postsList}
        />
      )}

      {/* Create Post Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Create Post</Text>

            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}

            <TextInput
              style={[
                styles.captionInput,
                {
                  backgroundColor: theme.secondaryBackground,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Write a caption..."
              placeholderTextColor={theme.placeholderText}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={500}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.secondaryBackground }]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedImage(null);
                  setCaption('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCreatePost}>
                <LinearGradient
                  colors={isDark ? ['#0A84FF', '#5E5CE6'] : ['#007AFF', '#5856D6']}
                  style={styles.postButton}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.commentModalContent, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.commentModalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Comments</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Text style={[styles.closeButton, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id.toString()}
              style={styles.commentsList}
              ListEmptyComponent={
                <Text style={[styles.noComments, { color: theme.secondaryText }]}>
                  No comments yet
                </Text>
              }
            />

            <View style={[styles.commentInputContainer, { borderTopColor: theme.border }]}>
              <TextInput
                style={[
                  styles.commentInput,
                  {
                    backgroundColor: theme.secondaryBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Add a comment..."
                placeholderTextColor={theme.placeholderText}
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity onPress={handleAddComment}>
                <LinearGradient
                  colors={isDark ? ['#0A84FF', '#5E5CE6'] : ['#007AFF', '#5856D6']}
                  style={styles.sendCommentButton}
                >
                  <Text style={styles.sendCommentText}>➤</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </LinearGradient>

      {/* Story Viewer Modal */}
      <Modal
        visible={storyModalVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setStoryModalVisible(false)}
      >
        <View style={[styles.storyViewer, { backgroundColor: '#000000' }]}>
          {selectedStory && (
            <>
              <TouchableOpacity
                style={styles.storyCloseButton}
                onPress={() => setStoryModalVisible(false)}
              >
                <Text style={styles.storyCloseText}>✕</Text>
              </TouchableOpacity>
              
              <View style={styles.storyHeader}>
                <Image
                  source={getProfileImage(selectedStory.username)}
                  style={styles.storyHeaderAvatar}
                />
                <Text style={styles.storyHeaderUsername}>
                  {selectedStory.username}
                </Text>
              </View>

              <Image
                source={{ uri: selectedStory.latestStory.image_uri }}
                style={styles.storyFullImage}
                resizeMode="contain"
              />

              {/* Action Buttons Row */}
              <View style={styles.storyActionsRow}>
                {/* Delete Button (only for own stories) */}
                {selectedStory.username === currentUser && (
                  <TouchableOpacity
                    style={styles.storyActionButton}
                    onPress={() => {
                      Alert.alert('Delete Story', 'Are you sure you want to delete this story?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => {
                            db.runSync('DELETE FROM stories WHERE id = ?', [selectedStory.latestStory.id]);
                            setStoryModalVisible(false);
                            loadStories();
                            Alert.alert('Success', 'Story deleted successfully');
                          },
                        },
                      ]);
                    }}
                  >
                    <LinearGradient
                      colors={['#ff6b6b', '#ee5a6f']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.storyActionGradient}
                    >
                      <Text style={styles.storyActionEmoji}>🗑️</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {/* Reaction Buttons */}
                <TouchableOpacity
                  style={styles.storyActionButton}
                  onPress={() => {
                    Alert.alert('Reaction', '😂 HAHA reaction sent!');
                  }}
                >
                  <LinearGradient
                    colors={['#ffd93d', '#f6c23e']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.storyActionGradient}
                  >
                    <Text style={styles.storyActionEmoji}>😂</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.storyActionButton}
                  onPress={() => {
                    Alert.alert('Reaction', '❤️ HEART reaction sent!');
                  }}
                >
                  <LinearGradient
                    colors={['#ff6b9d', '#f06292']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.storyActionGradient}
                  >
                    <Text style={styles.storyActionEmoji}>❤️</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  decorShape: {
    position: 'absolute',
    borderRadius: 1000,
  },
  shape1: {
    width: 280,
    height: 280,
    top: -120,
    left: -90,
  },
  shape2: {
    width: 200,
    height: 200,
    bottom: 100,
    right: -70,
  },
  shape3: {
    width: 160,
    height: 160,
    top: '35%',
    left: -50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButtonContainer: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  storiesSection: {
    marginBottom: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  storiesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  storiesList: {
    flex: 1,
  },
  storiesScroll: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  addStoryContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 70,
  },
  addStoryGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  addStoryIcon: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 70,
  },
  storyGradientBorder: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  storyInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  storyUsername: {
    fontSize: 12,
    textAlign: 'center',
  },
  postsList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  postCard: {
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postHeaderText: {
    flex: 1,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 20,
    padding: 5,
  },
  postImage: {
    width: '100%',
    height: 350,
    backgroundColor: '#f0f0f0',
  },
  reactionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  reactionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  reactionBtnActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  reactionEmoji: {
    fontSize: 18,
  },
  reactionCount: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  totalReactions: {
    fontSize: 12,
    fontWeight: '600',
  },
  captionContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 8,
  },
  captionUsername: {
    fontWeight: '600',
    fontSize: 15,
  },
  postCaption: {
    fontSize: 15,
    flex: 1,
  },
  commentButton: {
    padding: 12,
    paddingTop: 8,
  },
  commentButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
  },
  captionInput: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 15,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  commentModalContent: {
    borderRadius: 20,
    padding: 20,
    height: '75%',
    marginTop: 'auto',
  },
  commentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  closeButton: {
    fontSize: 24,
  },
  commentsList: {
    flex: 1,
    marginBottom: 15,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
  },
  commentAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 11,
  },
  deleteCommentButton: {
    fontSize: 18,
    padding: 5,
  },
  noComments: {
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 10,
  },
  commentInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 80,
    borderWidth: 1,
  },
  sendCommentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendCommentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyViewer: {
    flex: 1,
    justifyContent: 'center',
  },
  storyCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyCloseText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  storyHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  storyHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  storyHeaderUsername: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  storyFullImage: {
    width: width,
    height: '100%',
  },
  storyActionsRow: {
    position: 'absolute',
    top: 100,
    right: 20,
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center',
  },
  storyActionButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  storyActionGradient: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyActionEmoji: {
    fontSize: 22,
  },
});