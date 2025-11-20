import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { insertUser, updateUserProfilePic } from './database';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to select a profile picture');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignup = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const result = insertUser(username, password);
    
    if (result.success) {
      // Save profile picture URI if selected
      if (profileImage) {
        updateUserProfilePic(username, profileImage);
      }
      
      Alert.alert('Success', 'Account created!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
      setUsername('');
      setPassword('');
      setProfileImage(null);
    } else {
      Alert.alert('Error', 'Username already exists or signup failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <LinearGradient
        colors={['#fa709a', '#fee140', '#30cfd0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Cute decorative stars */}
        <View style={[styles.decorStar, styles.star1]} />
        <View style={[styles.decorStar, styles.star2]} />
        <View style={[styles.decorStar, styles.star3]} />
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.headerContainer}>
            
              <Text style={styles.title}>Create Account</Text>
            </View>

            {/* Profile Picture Selection */}
            <View style={styles.profilePicContainer}>
              <TouchableOpacity 
                style={styles.profilePicButton} 
                onPress={pickImage}
              >
                <LinearGradient
                  colors={profileImage ? ['transparent', 'transparent'] : ['#667EEA', '#764BA2']}
                  style={styles.profilePicGradient}
                >
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profilePic} />
                  ) : (
                    <View style={styles.placeholderPic}>
                      <Text style={styles.placeholderText}>📷</Text>
                      <Text style={styles.placeholderSubtext}>Add Photo</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.photoHint}>✨ Tap to select profile picture</Text>
            </View>

            {/* Input Fields */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Text style={styles.inputIcon}>👤</Text>
              </View>
              <TextInput
                placeholder="Username"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
              </View>
              <TextInput
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Signup Button */}
            <TouchableOpacity onPress={handleSignup}>
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Sign Up </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkBold}>Login</Text>
              </Text>
            </TouchableOpacity>

            {/* Info Button */}
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => navigation.navigate('Info')}
            >
              <Text style={styles.infoText}>ⓘ About</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  decorStar: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  star1: {
    width: 100,
    height: 100,
    top: 50,
    right: 30,
  },
  star2: {
    width: 140,
    height: 140,
    bottom: 150,
    left: -30,
  },
  star3: {
    width: 80,
    height: 80,
    top: '40%',
    left: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 60,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profilePicButton: {
    marginBottom: 10,
  },
  profilePicGradient: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  profilePic: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  placeholderPic: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
    marginBottom: 5,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
  photoHint: {
    fontSize: 13,
    color: '#999',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  inputIconContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputIcon: {
    fontSize: 22,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 20,
  },
  button: {
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 15,
  },
  linkBold: {
    color: '#667EEA',
    fontWeight: '600',
  },
  infoButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#667EEA',
    fontWeight: '600',
  },
});