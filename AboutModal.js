        import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutModal({ visible, onClose, theme, isDark }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <LinearGradient
          colors={isDark ? ['#1C1C1E', '#000000'] : ['#007AFF', '#5856D6']}
          style={styles.header}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Creator</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Creator Card */}
          <View style={[styles.creatorCard, { backgroundColor: theme.cardBackground }]}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={isDark ? ['#0A84FF', '#5E5CE6'] : ['#007AFF', '#5856D6']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarIcon}>👩‍💻</Text>
              </LinearGradient>
            </View>

            {/* Name */}
            <Text style={[styles.creatorName, { color: theme.text }]}>
              Daisyjoy B. Cutamora
            </Text>

            {/* Bio */}
            <Text style={[styles.creatorBio, { color: theme.primary }]}>
              "Surviving, Thriving, and Striving"
            </Text>

            {/* Divider */}
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border },
              ]}
            />

            {/* Info Section */}
            <View style={styles.infoSection}>
              <InfoItem
                label="Submitted By"
                value="Daisyjoy B. Cutamora"
                theme={theme}
                icon="✍️"
              />
              <InfoItem
                label="Submitted To"
                value="Ian Jay F. Camelotes"
                theme={theme}
                icon="👨‍🏫"
              />
              <InfoItem
                label="Address"
                value="Union, Ubay, Bohol"
                theme={theme}
                icon="📍"
              />
              <InfoItem
                label="Course & Block"
                value="BSIT 3-Block 3"
                theme={theme}
                icon="🎓"
              />
              <InfoItem
                label="Subject"
                value="IT Elective 1"
                theme={theme}
                icon="📚"
              />
            </View>
          </View>

          {/* Project Info */}
          <View style={[styles.projectCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              📱 Project Information
            </Text>
            <Text style={[styles.projectDescription, { color: theme.secondaryText }]}>
              SocialConnect is a modern, feature-rich social messaging and feed application built with React Native and Expo.
            </Text>
          </View>

          {/* Features List */}
          <View style={[styles.featuresCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              ✨ App Features
            </Text>

            <FeatureItem
              icon="🌙"
              title="Dark/Light Mode"
              description="Beautiful theme toggle"
              theme={theme}
            />
            <FeatureItem
              icon="👤"
              title="User Profiles"
              description="Custom bios and profile pictures"
              theme={theme}
            />
            <FeatureItem
              icon="💬"
              title="Real-time Messaging"
              description="Instant chat with online status"
              theme={theme}
            />
            <FeatureItem
              icon="😊"
              title="Message Reactions"
              description="React to messages with emojis"
              theme={theme}
            />
            <FeatureItem
              icon="📸"
              title="Image Sharing"
              description="Share photos in chats & posts"
              theme={theme}
            />
            <FeatureItem
              icon="🔥"
              title="Social Feed"
              description="Create posts and engage with others"
              theme={theme}
            />
            <FeatureItem
              icon="👍"
              title="Post Reactions"
              description="React to posts with emoji reactions"
              theme={theme}
            />
            <FeatureItem
              icon="💭"
              title="Comments"
              description="Comment on posts and delete comments"
              theme={theme}
            />
            <FeatureItem
              icon="📖"
              title="24-Hour Stories"
              description="Share temporary stories that auto-delete"
              theme={theme}
            />
            <FeatureItem
              icon="🔍"
              title="Search"
              description="Find users quickly with real-time search"
              theme={theme}
            />
            <FeatureItem
              icon="🎨"
              title="Modern UI"
              description="Glassmorphism design with gradients"
              theme={theme}
            />
            <FeatureItem
              icon="⚡"
              title="Smooth Animations"
              description="Beautiful transitions and effects"
              theme={theme}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.secondaryText }]}>
              Made with ❤️ for IT Elective 1
            </Text>
            <Text style={[styles.footerText, { color: theme.secondaryText }]}>
              © 2024 SocialConnect - All Rights Reserved
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const InfoItem = ({ label, value, theme, icon }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>
        {value}
      </Text>
    </View>
  </View>
);

const FeatureItem = ({ icon, title, description, theme }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureContent}>
      <Text style={[styles.featureTitle, { color: theme.text }]}>
        {title}
      </Text>
      <Text style={[styles.featureDescription, { color: theme.secondaryText }]}>
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  creatorCard: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarIcon: {
    fontSize: 50,
  },
  creatorName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  creatorBio: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 15,
  },
  infoSection: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 10,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  featuresCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  projectDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 10,
  },
  featureIcon: {
    fontSize: 22,
    marginRight: 12,
    marginTop: 2,
    width: 30,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
});