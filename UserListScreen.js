import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getUserWithProfilePic,
  updateUserBio,
  updateUserProfilePic,
} from './database';
import { useTheme } from './ThemeContext';

export default function UserListScreen({ route, navigation }) {
  const { currentUser } = route.params;
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [editBio, setEditBio] = useState('');
  const { theme, isDark, toggleTheme } = useTheme();

  useEffect(() => {
    loadUsers();
    loadCurrentUserData();
    
    // Update status to online
    updateUserStatus(currentUser, 'online');

    // Set interval to keep updating status
    const interval = setInterval(() => {
      updateUserStatus(currentUser, 'online');
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    const filteredUsers = allUsers.filter((user) => user.username !== currentUser);
    setUsers(filteredUsers);
  };

  const loadCurrentUserData = () => {
    const userData = getUserWithProfilePic(currentUser);
    setCurrentUserData(userData);
    setEditBio(userData?.bio || '');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          updateUserStatus(currentUser, 'offline');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const handleFeed = () => {
    navigation.navigate('Feed', {
      currentUser: currentUser,
    });
  };

  const handleUserPress = (selectedUser) => {
    navigation.navigate('Chat', {
      currentUser: currentUser,
      otherUser: selectedUser.username,
    });
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const result = deleteUser(user.username);
            if (result.success) {
              Alert.alert('Success', 'User deleted');
              loadUsers();
            }
          },
        },
      ]
    );
  };

  const handleUpdateBio = () => {
    const result = updateUserBio(currentUser, editBio);
    if (result.success) {
      Alert.alert('Success', 'Bio updated!');
      loadCurrentUserData();
      setProfileModalVisible(false);
    }
  };

  const handleChangeProfilePic = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const updateResult = updateUserProfilePic(currentUser, result.assets[0].uri);
      if (updateResult.success) {
        Alert.alert('Success', 'Profile picture updated!');
        loadCurrentUserData();
      }
    }
  };

  const getProfileImage = (profilePic) => {
    if (profilePic && profilePic.startsWith('file://')) {
      return { uri: profilePic };
    }
    return require('./assets/adaptive-icon.png');
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={[styles.userCard, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleUserPress(item)}
      onLongPress={() => handleDeleteUser(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={getProfileImage(item.profile_pic)} style={styles.avatar} />
        {item.status === 'online' && <View style={[styles.onlineDot, { backgroundColor: theme.online }]} />}
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.username, { color: theme.text }]}>{item.username}</Text>
        <Text style={[styles.bio, { color: theme.secondaryText }]} numberOfLines={1}>
          {item.bio || 'Hey there! I am using this app.'}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: item.status === 'online' ? theme.online : theme.offline }]}>
          {item.status === 'online' ? '● Online' : '○ Offline'}
        </Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDark ? ['#667eea', '#764ba2', '#f093fb'] : ['#a8edea', '#fed6e3', '#ffecd2', '#fbc2eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Decorative Elements */}
        <View style={[styles.decorativeDot, styles.dot1, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]} />
        <View style={[styles.decorativeDot, styles.dot2, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.5)' }]} />
        <View style={[styles.decorativeDot, styles.dot3, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)' }]} />
        <View style={[styles.decorativeDot, styles.dot4, { backgroundColor: isDark ? 'rgba(240,147,251,0.15)' : 'rgba(254,214,227,0.4)' }]} />
      {/* Header with Gradient */}
      <LinearGradient
        colors={isDark ? ['#1C1C1E', '#000000'] : ['#FFFFFF', '#F8F9FA']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
              <Image
                source={getProfileImage(currentUserData?.profile_pic)}
                style={styles.headerAvatar}
              />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>Messages</Text>
              <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
                @{currentUser}
              </Text>
            </View>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
              <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedButton, { backgroundColor: theme.success }]}
              onPress={handleFeed}
            >
              <Text style={styles.feedIcon}>📸</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: theme.error }]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.secondaryBackground }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search users..."
            placeholderTextColor={theme.placeholderText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            {searchQuery ? 'No users found' : 'No users available'}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.secondaryText }]}>
            {searchQuery ? 'Try a different search' : 'Create more accounts to start chatting'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Profile Modal */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <ScrollView>
              <Text style={[styles.modalTitle, { color: theme.text }]}>My Profile</Text>

              <TouchableOpacity style={styles.profilePicContainer} onPress={handleChangeProfilePic}>
                <Image
                  source={getProfileImage(currentUserData?.profile_pic)}
                  style={styles.modalProfilePic}
                />
                <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.editIcon}>✏️</Text>
                </View>
              </TouchableOpacity>

              <Text style={[styles.modalUsername, { color: theme.text }]}>@{currentUser}</Text>

              <View style={styles.bioContainer}>
                <Text style={[styles.bioLabel, { color: theme.secondaryText }]}>Bio</Text>
                <TextInput
                  style={[
                    styles.bioInput,
                    {
                      backgroundColor: theme.secondaryBackground,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="Write something about yourself..."
                  placeholderTextColor={theme.placeholderText}
                  value={editBio}
                  onChangeText={setEditBio}
                  multiline
                  maxLength={150}
                />
                <Text style={[styles.charCount, { color: theme.secondaryText }]}>
                  {editBio.length}/150
                </Text>
              </View>

              <TouchableOpacity onPress={handleUpdateBio}>
                <LinearGradient
                  colors={isDark ? ['#0A84FF', '#5E5CE6'] : ['#007AFF', '#5856D6']}
                  style={styles.updateButton}
                >
                  <Text style={styles.updateButtonText}>Update Bio</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.secondaryBackground }]}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={[styles.closeButtonText, { color: theme.text }]}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      </LinearGradient>
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
  decorativeDot: {
    position: 'absolute',
    borderRadius: 1000,
  },
  dot1: {
    width: 250,
    height: 250,
    top: -100,
    right: -80,
  },
  dot2: {
    width: 180,
    height: 180,
    bottom: 50,
    left: -60,
  },
  dot3: {
    width: 120,
    height: 120,
    top: '50%',
    right: -40,
  },
  dot4: {
    width: 200,
    height: 200,
    bottom: -60,
    right: 40,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  themeIcon: {
    fontSize: 20,
  },
  feedButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedIcon: {
    fontSize: 18,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
    padding: 5,
  },
  listContainer: {
    padding: 15,
    paddingTop: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  modalProfilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  editIcon: {
    fontSize: 16,
  },
  modalUsername: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  bioContainer: {
    marginBottom: 20,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  bioInput: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  updateButton: {
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});