package com.storyfeature.backend.model;

import java.util.List;

public class StoryUser {
    private String id;
    private String username;
    private String displayName;
    private String avatar;
    private List<StoryItem> stories;
    private boolean seen;

    public StoryUser() {}

    public StoryUser(String id, String username, String displayName, String avatar, List<StoryItem> stories) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.avatar = avatar;
        this.stories = stories;
        this.seen = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public List<StoryItem> getStories() { return stories; }
    public void setStories(List<StoryItem> stories) { this.stories = stories; }
    public boolean isSeen() { return seen; }
    public void setSeen(boolean seen) { this.seen = seen; }
}
