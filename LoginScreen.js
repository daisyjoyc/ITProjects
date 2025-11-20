// LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { checkLogin, dropAllTables, createTables } from './database';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAbout, setShowAbout] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const isValid = checkLogin(username, password);
    if (isValid) {
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => navigation.navigate('UserList', { currentUser: username }) }
      ]);
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  // Remove this after testing
  const handleResetDatabase = () => {
    Alert.alert('Reset Database', 'Delete all data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          dropAllTables();
          createTables();
          Alert.alert('Success', 'Database reset!');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* SINGLE ABOUT BUTTON */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#5856d6' }]}
          onPress={() => setShowAbout(true)}
        >
          <Text style={styles.buttonText}>About & Features</Text>
        </TouchableOpacity>

        {/* Remove this button after submission */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ff3b30', marginTop: 8 }]}
          onPress={handleResetDatabase}
        >
          <Text style={styles.buttonText}>Reset Database</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* ABOUT MODAL - Everything inside here */}
      <Modal visible={showAbout} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Profile Picture */}
              <View style={styles.profileContainer}>
                <Image
                  source={require('./assets/avatar1.jpg')}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                <Text style={styles.name}>Ma. Janen C. Autentico</Text>
                <Text style={styles.bio}>"My name is Ma. Janen Autentico, 21 years old. I am currently studying at Trinidad Municipal College taking a bachelor of Science in Information Technology. And I am someone who values hard work and consistency. I focus on doing my tasks well, learning from challenges, and improving little by little every day."</Text>
              </View>

              {/* Student Info */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Project Submission</Text>
                <Text style={styles.infoText}>Submitted by: Ma. Janen C. Autentico</Text>
                <Text style={styles.infoText}>Submitted to: Ian Jay F. Camelotes</Text>
                <Text style={styles.infoText}>Address: La Victoria, Trinidad, Bohol</Text>
                <Text style={styles.infoText}>Course & Block:  BSIT 3 - Block 3</Text>
                <Text style={styles.infoText}>Subject: IT Elective 1</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ff3b30', marginTop: 20 }]}
              onPress={() => setShowAbout(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  linkText: { textAlign: 'center', color: '#666', fontSize: 15, marginTop: 20 },
  linkBold: { color: '#007AFF', fontWeight: '600' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '92%',
    maxHeight: '90%',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  profileContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#007AFF',
    marginBottom: 15,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  bio: { fontSize: 16, color: '#007AFF', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 25,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoSection: { marginTop: 10 },
  infoText: { fontSize: 16, color: '#444', lineHeight: 26 },
  feature: { fontSize: 16, color: '#333', lineHeight: 28, marginLeft: 10 },
});