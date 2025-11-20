import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  insertMessage,
  getMessagesBetweenUsers,
  getUserWithProfilePic,
  addMessageReaction,
  deleteMessage,
} from './database';
import { useTheme } from './ThemeContext';

export default function ChatScreen({ route, navigation }) {
  const { currentUser, otherUser } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUserPic, setCurrentUserPic] = useState(null);
  const [otherUserPic, setOtherUserPic] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const flatListRef = useRef(null);
  const { theme, isDark } = useTheme();

  const reactions = ['❤️', '😂', '😮', '😢', '😡', '👍', '👎', '🔥'];

  useEffect(() => {
    loadMessages();
    loadProfilePics();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadProfilePics = () => {
    const currentUserData = getUserWithProfilePic(currentUser);
    const otherData = getUserWithProfilePic(otherUser);

    if (currentUserData?.profile_pic) {
      setCurrentUserPic(currentUserData.profile_pic);
    }
    if (otherData?.profile_pic) {
      setOtherUserPic(otherData.profile_pic);
    }
    setOtherUserData(otherData);
  };

  const loadMessages = () => {
    const chatMessages = getMessagesBetweenUsers(currentUser, otherUser);
    setMessages(chatMessages);
  };

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }

    const result = insertMessage(currentUser, otherUser, message.trim(), 'text');

    if (result.success) {
      setMessage('');
      loadMessages();
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSendImage = async () => {
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
      const insertResult = insertMessage(
        currentUser,
        otherUser,
        result.assets[0].uri,
        'image'
      );

      if (insertResult.success) {
        loadMessages();
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  };

  const handleLongPress = (item) => {
    setSelectedMessage(item);
    setReactionModalVisible(true);
  };

  const handleAddReaction = (reaction) => {
    if (selectedMessage) {
      addMessageReaction(selectedMessage.id, reaction);
      loadMessages();
      setReactionModalVisible(false);
      setSelectedMessage(null);
    }
  };

  const handleDeleteMessage = (item) => {
    if (item.sender !== currentUser) {
      Alert.alert('Error', 'You can only delete your own messages');
      return;
    }

    Alert.alert('Delete Message', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteMessage(item.id);
          loadMessages();
        },
      },
    ]);
  };

  const getProfileImage = (profilePic) => {
    if (profilePic && profilePic.startsWith('file://')) {
      return { uri: profilePic };
    }
    return require('./assets/adaptive-icon.png');
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === currentUser;
    const profilePic = isMyMessage ? currentUserPic : otherUserPic;

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item)}
        onPress={() => {
          if (isMyMessage) {
            handleDeleteMessage(item);
          }
        }}
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {!isMyMessage && (
          <Image source={getProfileImage(profilePic)} style={styles.profilePic} />
        )}

        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isMyMessage ? theme.myMessageBg : theme.otherMessageBg,
            },
          ]}
        >
          {item.message_type === 'image' ? (
            <Image source={{ uri: item.message }} style={styles.messageImage} />
          ) : (
            <Text
              style={[
                styles.messageText,
                { color: isMyMessage ? theme.myMessageText : theme.otherMessageText },
              ]}
            >
              {item.message}
            </Text>
          )}

          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.timestamp,
                {
                  color: isMyMessage
                    ? 'rgba(255, 255, 255, 0.7)'
                    : theme.secondaryText,
                },
              ]}
            >
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {item.reaction && (
              <Text style={styles.reactionBadge}>{item.reaction}</Text>
            )}
          </View>
        </View>

        {isMyMessage && (
          <Image source={getProfileImage(profilePic)} style={styles.profilePic} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <LinearGradient
        colors={isDark ? ['#4568dc', '#b06ab3'] : ['#ffecd2', '#fcb69f', '#d4fc79', '#96e6a1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Decorative Bubbles */}
        <View style={[styles.decorBubble, styles.bubble1, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)' }]} />
        <View style={[styles.decorBubble, styles.bubble2, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.35)' }]} />
        <View style={[styles.decorBubble, styles.bubble3, { backgroundColor: isDark ? 'rgba(176,106,179,0.15)' : 'rgba(212,252,121,0.3)' }]} />
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
            <Text style={styles.backIcon}>x</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerUserInfo}>
          <Image source={getProfileImage(otherUserPic)} style={styles.headerAvatar} />
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{otherUser}</Text>
            <View style={styles.statusContainer}>
              {otherUserData?.status === 'online' && (
                <View style={[styles.onlineDot, { backgroundColor: theme.online }]} />
              )}
              <Text style={[styles.statusText, { color: theme.secondaryText }]}>
                {otherUserData?.status === 'online' ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSendImage} style={styles.imageButton}>
          <Text style={styles.imageIcon}>📷</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input Container */}
      <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.secondaryBackground,
              color: theme.text,
            },
          ]}
          placeholder="Type a message..."
          placeholderTextColor={theme.placeholderText}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity onPress={handleSend}>
          <LinearGradient
            colors={isDark ? ['#0A84FF', '#5E5CE6'] : ['#007AFF', '#5856D6']}
            style={styles.sendButton}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Reaction Modal */}
      <Modal
        visible={reactionModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReactionModalVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}
          activeOpacity={1}
          onPress={() => setReactionModalVisible(false)}
        >
          <View style={[styles.reactionModal, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.reactionTitle, { color: theme.text }]}>
              React to message
            </Text>
            <View style={styles.reactionsContainer}>
              {reactions.map((reaction) => (
                <TouchableOpacity
                  key={reaction}
                  style={styles.reactionButton}
                  onPress={() => handleAddReaction(reaction)}
                >
                  <Text style={styles.reactionEmoji}>{reaction}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  decorBubble: {
    position: 'absolute',
    borderRadius: 1000,
  },
  bubble1: {
    width: 220,
    height: 220,
    top: -80,
    right: -60,
  },
  bubble2: {
    width: 160,
    height: 160,
    bottom: 150,
    left: -50,
  },
  bubble3: {
    width: 140,
    height: 140,
    top: '30%',
    right: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButtonContainer: {
    marginRight: 10,
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
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  imageIcon: {
    fontSize: 20,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 5,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  reactionBadge: {
    fontSize: 16,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 15,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    minHeight: 40,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionModal: {
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  reactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  reactionButton: {
    padding: 12,
    margin: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  reactionEmoji: {
    fontSize: 32,
  },
});