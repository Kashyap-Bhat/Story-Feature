import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { API_BASE_URL } from '../constants/config';

const TOP_PAD = Platform.OS === 'web' ? 32 : 16;

const StoryList = ({ stories, loading, error, onStoryPress, seenUsers }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleStories = expanded ? stories : stories.slice(0, 6);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading stories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load stories</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No stories from people you follow</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Stories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visibleStories.map((user) => {
          const isSeen = seenUsers.includes(user.id);
          return (
            <TouchableOpacity
              key={user.id}
              style={styles.storyItem}
              onPress={() => onStoryPress(user)}
            >
              <View style={[
                styles.avatarRing,
                isSeen && styles.avatarRingSeen
              ]}>
                <View style={styles.avatarRingInner}>
                  <Image
                    source={{ uri: `${API_BASE_URL}${user.avatar}` }}
                    style={styles.avatar}
                  />
                </View>
              </View>
              <Text style={styles.username} numberOfLines={1}>
                {user.username}
              </Text>
            </TouchableOpacity>
          );
        })}
        {stories.length > 6 && !expanded && (
          <TouchableOpacity
            style={styles.seeAllItem}
            onPress={() => setExpanded(true)}
          >
            <View style={[styles.seeAllRing, styles.seeAllRingInner]}>
              <Text style={styles.seeAllText}>+{stories.length - 6}</Text>
            </View>
            <Text style={styles.seeAllLabel}>See All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingTop: TOP_PAD,
    paddingBottom: 16,
  },
  headerRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  centerContainer: {
    backgroundColor: '#000',
    paddingTop: TOP_PAD + 24,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 68,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#E1306C',
  },
  avatarRingSeen: {
    borderColor: '#555',
  },
  avatarRingInner: {
    padding: 2,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#000',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1a1a1a',
  },
  username: {
    color: '#fff',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },
  seeAllItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 68,
  },
  seeAllRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAllRingInner: {
    borderWidth: 0,
  },
  seeAllText: {
    color: '#E1306C',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorDetail: {
    color: '#888',
    marginTop: 4,
    fontSize: 12,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default StoryList;
