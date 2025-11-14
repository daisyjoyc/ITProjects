import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { insertMessage, getMessagesBetweenUsers, getUserWithProfilePic } from './database';

export default function ChatScreen({ route }) {
  const { currentUser, otherUser } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUserPic, setCurrentUserPic] = useState(null);
  const [otherUserPic, setOtherUserPic] = useState(null);

  useEffect(() => {
    loadMessages();
    loadProfilePics();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadProfilePics = () => {
    const currentUserData = getUserWithProfilePic(currentUser);
    const otherUserData = getUserWithProfilePic(otherUser);

    if (currentUserData?.profile_pic) {
      setCurrentUserPic(currentUserData.profile_pic);
    }
    if (otherUserData?.profile_pic) {
      setOtherUserPic(otherUserData.profile_pic);
    }
  };

  const loadMessages = () => {
    const chatMessages = getMessagesBetweenUsers(currentUser, otherUser);
    setMessages(chatMessages);
  };

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }

    const result = insertMessage(currentUser, otherUser, message.trim());

    if (result.success) {
      setMessage('');
      loadMessages();
    }
  };

  const getProfileImage = (profilePic) => {
    if (profilePic && profilePic.startsWith('file://')) {
      return { uri: profilePic };
    }
    // Default placeholder if no image
    return require('./assets/adaptive-icon.png');
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === currentUser;
    const profilePic = isMyMessage ? currentUserPic : otherUserPic;

    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        {/* Profile Picture - Show on left for other user */}
        {!isMyMessage && (
          <Image 
            source={getProfileImage(profilePic)} 
            style={styles.profilePic}
          />
        )}

        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessage : styles.otherMessage
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.message}
          </Text>
          <Text style={[
            styles.timestamp,
            isMyMessage ? styles.myTimestamp : styles.otherTimestamp
          ]}>
            {new Date(item.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>

        {/* Profile Picture - Show on right for current user */}
        {isMyMessage && (
          <Image 
            source={getProfileImage(profilePic)} 
            style={styles.profilePic}
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Image 
          source={getProfileImage(otherUserPic)} 
          style={styles.headerAvatar}
        />
        <Text style={styles.headerTitle}>{otherUser}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  messagesList: {
    padding: 15,
    paddingBottom: 80,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '65%',
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherTimestamp: {
    color: '#999',
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 40,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});