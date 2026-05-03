package com.storyfeature.backend.controller;

import com.storyfeature.backend.model.StoryItem;
import com.storyfeature.backend.model.StoryUser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class StoryController {

    private JsonNode storiesData;

    private JsonNode loadStoriesData() throws Exception {
        if (storiesData == null) {
            ClassPathResource resource = new ClassPathResource("json/stories.json");
            try (InputStream is = resource.getInputStream()) {
                ObjectMapper mapper = new ObjectMapper();
                storiesData = mapper.readTree(is);
            }
        }
        return storiesData;
    }

    @GetMapping("/stories")
    public List<StoryUser> getStories() throws Exception {
        JsonNode data = loadStoriesData();
        JsonNode follows = data.get("follows");
        JsonNode users = data.get("users");
        long now = System.currentTimeMillis();
        List<StoryUser> result = new ArrayList<>();

        for (JsonNode userId : follows) {
            String uid = userId.asText();
            JsonNode user = users.get(uid);
            if (user != null) {
                List<StoryItem> userStories = new ArrayList<>();
                JsonNode storiesArr = user.get("stories");
                if (storiesArr != null) {
                    for (JsonNode story : storiesArr) {
                        long offsetMs = story.get("timestamp").asLong();
                        long actualTimestamp = now - offsetMs;
                        userStories.add(new StoryItem(
                            story.get("id").asText(),
                            story.get("imageUrl").asText(),
                            actualTimestamp
                        ));
                    }
                }
                StoryUser storyUser = new StoryUser(
                    user.get("id").asText(),
                    user.get("username").asText(),
                    user.get("displayName").asText(),
                    user.get("avatar").asText(),
                    userStories
                );
                result.add(storyUser);
            }
        }
        return result;
    }

    @PostMapping("/stories/{userId}/seen")
    public void markSeen(@PathVariable String userId) {
    }
}
