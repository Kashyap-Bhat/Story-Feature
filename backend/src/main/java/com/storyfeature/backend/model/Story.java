package com.storyfeature.backend.model;

public class Story {
    private String id;
    private String username;
    private String imageUrl;
    private long timestamp;

    public Story() {}

    public Story(String id, String username, String imageUrl, long timestamp) {
        this.id = id;
        this.username = username;
        this.imageUrl = imageUrl;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
