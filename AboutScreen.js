import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AboutScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>About This Project</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Submitted by:</Text>
          <Text style={styles.value}>Ma. Janen C. Autentico</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Submitted to:</Text>
          <Text style={styles.value}>Ian Jay F. Camelotes</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bio:</Text>
          <Text style={styles.value}>"Adventure is out there, and so am I"</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>La Victoria, Trinidad, Bohol</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Course & Block:</Text>
          <Text style={styles.value}>BSIT 3 - Block 3</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Subject:</Text>
          <Text style={styles.value}>IT Elective 1</Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },
  backButton: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});