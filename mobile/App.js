import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import StoryList from './components/StoryList';
import StoryViewer from './components/StoryViewer';
import { API_BASE_URL } from './constants/config';

const TOP_PADDING = Platform.OS === 'web' ? 50 : 0;

export default function App() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [seenUsers, setSeenUsers] = useState([]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stories`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      setStories(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStoryPress = (user) => {
    const index = stories.findIndex((u) => u.id === user.id);
    setSelectedUserIndex(index);
  };

  const handleCloseViewer = () => {
    setSelectedUserIndex(null);
  };

  const handleMarkSeen = (userId) => {
    if (!seenUsers.includes(userId)) {
      setSeenUsers([...seenUsers, userId]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={[styles.content, { paddingTop: TOP_PADDING }]}>
        {selectedUserIndex !== null ? (
          <StoryViewer
            stories={stories}
            initialUserIndex={selectedUserIndex}
            onClose={handleCloseViewer}
            onMarkSeen={handleMarkSeen}
          />
        ) : (
          <StoryList
            stories={stories}
            loading={loading}
            error={error}
            onStoryPress={handleStoryPress}
            seenUsers={seenUsers}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
});
