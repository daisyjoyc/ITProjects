import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { checkLogin, updateUserStatus } from './database';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isDark] = useState(false);

  // Theme object (light mode by default)
  const theme = {
    background: isDark ? '#000000' : '#F8F9FA',
    cardBackground: isDark ? '#1C1C1E' : '#FFFFFF',
    secondaryBackground: isDark ? '#2C2C2E' : '#F2F2F7',
    text: isDark ? '#FFFFFF' : '#000000',
    secondaryText: isDark ? '#8E8E93' : '#8E8E93',
    placeholderText: isDark ? '#636366' : '#C7C7CC',
    primary: isDark ? '#0A84FF' : '#007AFF',
    border: isDark ? '#38383A' : '#E5E5EA',
  };

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const isValid = checkLogin(username, password);

    if (isValid) {
      updateUserStatus(username, 'online');
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserList', params: { currentUser: username } }],
      });
      setUsername('');
      setPassword('');
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={isDark ? ['#1e3c72', '#2a5298', '#7e22ce'] : ['#ffecd2', '#fcb69f', '#ff9a9e', '#fad0c4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Decorative Circles */}
        <View style={[styles.decorativeCircle, styles.circle1, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)' }]} />
        <View style={[styles.decorativeCircle, styles.circle2, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)' }]} />
        <View style={[styles.decorativeCircle, styles.circle3, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.45)' }]} />
        <View style={[styles.decorativeCircle, styles.circle4, { backgroundColor: isDark ? 'rgba(126,34,206,0.15)' : 'rgba(255,154,158,0.3)' }]} />
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Login Form */}
          <View style={[styles.formContainer, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.welcomeText, { color: theme.text }]}>Hello!</Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              Sign in to continue
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Username</Text>
              <TextInput
                placeholder="Enter your username"
                placeholderTextColor={theme.placeholderText}
                value={username}
                onChangeText={setUsername}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.secondaryBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={theme.placeholderText}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.secondaryBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity onPress={handleLogin}>
              <LinearGradient
                colors={['#007AFF', '#5856D6']}
                style={styles.loginButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.secondaryText }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <LinearGradient
                colors={isDark ? ['#fa709a', '#fee140'] : ['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signupButton}
              >
                <Text style={styles.signupButtonTextNew}>Create New Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Developer Info Button */}
            <TouchableOpacity 
              style={styles.developerInfoButton}
              onPress={() => navigation.navigate('Info')}
            >
              <LinearGradient
                colors={['#FF6B9D', '#C06C84']}
                style={styles.developerInfoGradient}
              >
                <Text style={styles.developerInfoText}>ⓘ About Info</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
      </LinearGradient>

      {/* Features Modal */}
      <Modal visible={showFeatures} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>🌟 App Features</Text>
              
              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureIcon}>💬</Text>
                  <Text style={styles.featureTitle}>Real-Time Chat</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Send and receive messages instantly with other users. Enjoy smooth, 
                  real-time communication powered by SQLite database.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureIcon}>👤</Text>
                  <Text style={styles.featureTitle}>Custom Profiles</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Create your unique profile with a custom profile picture. Express yourself 
                  and make your account personal.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureIcon}>📱</Text>
                  <Text style={styles.featureTitle}>User-Friendly Interface</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Clean, modern design with intuitive navigation. Everything you need is 
                  just a tap away.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureIcon}>🗂️</Text>
                  <Text style={styles.featureTitle}>Local Database Storage</Text>
                </View>
                <Text style={styles.featureDescription}>
                  All your messages and data are stored securely on your device using 
                  SQLite. Fast and reliable.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureIcon}>📰</Text>
                  <Text style={styles.featureTitle}>Activity Feed</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Stay updated with your recent conversations and user activities in one 
                  convenient feed.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureIcon}>🔐</Text>
                  <Text style={styles.featureTitle}>Secure Authentication</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Your account is protected with secure login credentials. Only you can 
                  access your messages.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureIcon}>🌙</Text>
                  <Text style={styles.featureTitle}>Dark Mode Support</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Easy on the eyes with dark mode option. Switch between light and dark 
                  themes based on your preference.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureIcon}>🎨</Text>
                  <Text style={styles.featureTitle}>Beautiful Design</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Carefully crafted with attention to detail. Every screen is designed 
                  to be visually appealing and easy to use.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFeatures(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const FeatureTag = ({ icon, label, theme }) => (
  <View style={[styles.featureTag, { backgroundColor: theme.secondaryBackground }]}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={[styles.featureLabel, { color: theme.text }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 50,
  },
  formContainer: {
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  loginButton: {
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    fontWeight: '600',
  },
  signupButton: {
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 5,
  },
  signupButtonTextNew: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  developerInfoButton: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  developerInfoGradient: {
    padding: 16,
    alignItems: 'center',
  },
  developerInfoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '85%',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#34C759',
    textAlign: 'center',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#F9F9F9',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 40,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});