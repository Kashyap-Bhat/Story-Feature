import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  Platform,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { API_BASE_URL } from '../constants/config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TOP_SAFE = Platform.OS === 'web' ? 40 : 8;
const AUTO_ADVANCE_DURATION = 5000;

const followers = [
  { id: 'f1', username: 'jane.smith', avatar: 'https://i.pravatar.cc/40?img=1', displayName: 'Jane Smith' },
  { id: 'f2', username: 'mike.ross', avatar: 'https://i.pravatar.cc/40?img=3', displayName: 'Mike Ross' },
  { id: 'f3', username: 'sarah.kim', avatar: 'https://i.pravatar.cc/40?img=5', displayName: 'Sarah Kim' },
  { id: 'f4', username: 'david.wu', avatar: 'https://i.pravatar.cc/40?img=7', displayName: 'David Wu' },
  { id: 'f5', username: 'lisa.park', avatar: 'https://i.pravatar.cc/40?img=9', displayName: 'Lisa Park' },
  { id: 'f6', username: 'chris.brown', avatar: 'https://i.pravatar.cc/40?img=11', displayName: 'Chris Brown' },
  { id: 'f7', username: 'amy.chen', avatar: 'https://i.pravatar.cc/40?img=16', displayName: 'Amy Chen' },
  { id: 'f8', username: 'tom.harris', avatar: 'https://i.pravatar.cc/40?img=12', displayName: 'Tom Harris' },
];

const StoryViewer = ({ stories, initialUserIndex, onClose, onMarkSeen }) => {
  const [userIndex, setUserIndex] = useState(initialUserIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [replyText, setReplyText] = useState('');

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentUser = stories[userIndex];
  const currentStory = currentUser?.stories?.[storyIndex];
  const totalStoryBars = currentUser?.stories?.length || 0;

  useEffect(() => {
    startProgress();
    return () => {
      progressAnim.stopAnimation();
    };
  }, [userIndex, storyIndex]);

  const startProgress = () => {
    progressAnim.setValue(0);
    setImageLoading(true);
    setImageError(false);
    fadeAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: AUTO_ADVANCE_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        goToNext();
      }
    });
  };

  const goToNext = () => {
    progressAnim.setValue(0);
    if (storyIndex < currentUser.stories.length - 1) {
      setStoryIndex(storyIndex + 1);
    } else if (userIndex < stories.length - 1) {
      onMarkSeen(currentUser.id);
      setUserIndex(userIndex + 1);
      setStoryIndex(0);
    } else {
      onMarkSeen(currentUser.id);
      onClose();
    }
  };

  const goToPrev = () => {
    progressAnim.setValue(0);
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
    } else if (userIndex > 0) {
      setUserIndex(userIndex - 1);
      setStoryIndex(0);
    }
  };

  const handleTapLeft = () => {
    goToPrev();
  };

  const handleTapRight = () => {
    goToNext();
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (!currentUser) return null;

  const timeAgo = getTimeAgo(currentStory?.timestamp);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {currentUser.stories.map((_, index) => {
          const progressStyle = {};
          if (index < storyIndex) {
            progressStyle.width = '100%';
          } else if (index === storyIndex) {
            progressStyle.width = progressWidth;
          } else {
            progressStyle.width = '0%';
          }
          return (
            <View key={index} style={styles.progressBackground}>
              <Animated.View style={[styles.progressFill, progressStyle]} />
            </View>
          );
        })}
      </View>

      <View style={styles.header}>
        <Image
          source={{ uri: `${API_BASE_URL}${currentUser.avatar}` }}
          style={styles.headerAvatar}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.username}>{currentUser.username}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
        {imageLoading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        {imageError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load image</Text>
          </View>
        ) : (
          <Image
            source={{ uri: `${API_BASE_URL}${currentStory.imageUrl}` }}
            style={styles.image}
            resizeMode="contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </Animated.View>

      <TouchableOpacity
        style={styles.tapZoneLeft}
        onPress={handleTapLeft}
        activeOpacity={1}
      />
      <TouchableOpacity
        style={styles.tapZoneRight}
        onPress={handleTapRight}
        activeOpacity={1}
      />

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <View style={styles.replyBar}>
        <TextInput
          style={styles.replyInput}
          placeholder={`Reply to ${currentUser.username}...`}
          placeholderTextColor="#999"
          value={replyText}
          onChangeText={setReplyText}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => setShowShareSheet(true)}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showShareSheet}
        animationType="slide"
        transparent
        onRequestClose={() => setShowShareSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowShareSheet(false)}
          />
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Share to</Text>
              <TouchableOpacity
                style={styles.sheetCloseBtn}
                onPress={() => setShowShareSheet(false)}
              >
                <Text style={styles.sheetCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={followers}
              keyExtractor={(item) => item.id}
              style={styles.followerList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.followerItem}
                  onPress={() => setShowShareSheet(false)}
                >
                  <Image source={{ uri: item.avatar }} style={styles.followerAvatar} />
                  <View style={styles.followerInfo}>
                    <Text style={styles.followerName}>{item.displayName}</Text>
                    <Text style={styles.followerUsername}>@{item.username}</Text>
                  </View>
                  <View style={styles.followerSendIcon}>
                    <Text style={styles.followerSendText}>↑</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: TOP_SAFE,
    left: 8,
    right: 8,
    zIndex: 10,
    gap: 3,
  },
  progressBackground: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  header: {
    position: 'absolute',
    top: TOP_SAFE + 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#333',
  },
  headerTextContainer: {
    marginLeft: 8,
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeAgo: {
    color: '#ccc',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - TOP_SAFE,
  },
  tapZoneLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT,
    zIndex: 5,
  },
  tapZoneRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_HEIGHT,
    zIndex: 5,
  },
  closeButton: {
    position: 'absolute',
    top: TOP_SAFE + 8,
    right: 16,
    zIndex: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  replyBar: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sendButton: {
    backgroundColor: '#E1306C',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  sheetTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sheetCloseBtn: {
    padding: 4,
  },
  sheetCloseText: {
    color: '#999',
    fontSize: 16,
  },
  followerList: {
    paddingBottom: 24,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2a2a2a',
  },
  followerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
  },
  followerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  followerName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  followerUsername: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  followerSendIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E1306C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followerSendText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoryViewer;
