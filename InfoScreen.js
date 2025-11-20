import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');

export default function InfoScreen({ navigation }) {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDark ? ['#8e2de2', '#4a00e0'] : ['#ffecd2', '#fcb69f', '#ff9a9e', '#fecfef', '#d4fc79']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Decorative Hearts */}
        <View style={[styles.decorHeart, styles.heart1, { backgroundColor: isDark ? 'rgba(142,45,226,0.12)' : 'rgba(255,192,203,0.35)' }]} />
        <View style={[styles.decorHeart, styles.heart2, { backgroundColor: isDark ? 'rgba(142,45,226,0.1)' : 'rgba(255,207,239,0.3)' }]} />
        <View style={[styles.decorHeart, styles.heart3, { backgroundColor: isDark ? 'rgba(74,0,224,0.15)' : 'rgba(212,252,121,0.25)' }]} />
      {/* Header with Gradient */}
      <LinearGradient
        colors={isDark ? ['#FF6B9D', '#C06C84'] : ['#FFB6C1', '#FFE5EC']}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.backButtonGradient}
          >
            <Text style={styles.backIcon}>x</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Info</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.cardBackground }]}>
          <LinearGradient
            colors={isDark ? ['#FF6B9D', '#C06C84', '#8B5A83'] : ['#FFB6C1', '#FFC8DD', '#FFE5EC']}
            style={styles.profileImageContainer}
          >
            <View style={[styles.imageWrapper, { backgroundColor: theme.cardBackground }]}>
              <Image
                source={require('./assets/daisy-icon.png')}
                style={styles.profileImage}
              />
            </View>
          </LinearGradient>

          <Text style={[styles.name, { color: theme.text }]}>Daisy Joy Cutamora</Text>
        </View>

        {/* Bio Section */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Bio</Text>
          </View>
          <Text style={[styles.bioText, { color: theme.secondaryText }]}>
                She is a soft-hearted go-getter—curious, hardworking, and always eager to grow. 
            She brings warmth, humor, and determination to everything she learns, whether it's 
            coding, research, or solving life's tiny puzzles. A sweet spirit with a steady drive.
          </Text>
          <View style={styles.traitContainer}>
            <View style={[styles.traitBadge, { backgroundColor: theme.secondaryBackground }]}>
              <Text style={styles.traitEmoji}>🎯</Text>
              <Text style={[styles.traitText, { color: theme.text }]}>Go-Getter</Text>
            </View>
            <View style={[styles.traitBadge, { backgroundColor: theme.secondaryBackground }]}>
              <Text style={styles.traitEmoji}>💡</Text>
              <Text style={[styles.traitText, { color: theme.text }]}>Curious</Text>
            </View>
            <View style={[styles.traitBadge, { backgroundColor: theme.secondaryBackground }]}>
              <Text style={styles.traitEmoji}>💪</Text>
              <Text style={[styles.traitText, { color: theme.text }]}>Hardworking</Text>
            </View>
            <View style={[styles.traitBadge, { backgroundColor: theme.secondaryBackground }]}>
              <Text style={styles.traitEmoji}>🌟</Text>
              <Text style={[styles.traitText, { color: theme.text }]}>Determined</Text>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🏡</Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Location</Text>
          </View>
          <View style={[styles.locationBox, { backgroundColor: theme.secondaryBackground }]}>
            <Text style={[styles.locationText, { color: theme.text }]}>
              Union, Ubay, Bohol
            </Text>
        
          </View>
        </View>

        {/* Submission Details */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📄</Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Submission Details</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={[styles.detailBox, { backgroundColor: theme.secondaryBackground }]}>
              <Text style={styles.detailLabel}>👤 Submitted by:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                Daisy Joy B. Cutamora
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.detailBox, { backgroundColor: theme.secondaryBackground }]}>
              <Text style={styles.detailLabel}>📬 Submitted To</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                Jay Ian F. Camelotes
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  decorHeart: {
    position: 'absolute',
    borderRadius: 1000,
  },
  heart1: {
    width: 200,
    height: 200,
    top: -70,
    left: -60,
  },
  heart2: {
    width: 150,
    height: 150,
    bottom: 120,
    right: -50,
  },
  heart3: {
    width: 130,
    height: 130,
    top: '45%',
    left: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    shadowColor: '#000',
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
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  imageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 15,
  },
  section: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'justify',
    marginBottom: 15,
  },
  traitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  traitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    gap: 6,
  },
  traitEmoji: {
    fontSize: 16,
  },
  traitText: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  locationText: {
    fontSize: 17,
    fontWeight: '600',
  },
  locationEmoji: {
    fontSize: 28,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailBox: {
    padding: 16,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#C06C84',
  },
  detailLabel: {
    fontSize: 13,
    color: '#FF6B9D',
    fontWeight: '600',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 17,
    fontWeight: '600',
  },
});
