# Instagram Stories Feature

A simplified Instagram Stories feature built with **React Native (Expo)** for the mobile UI and **Spring Boot** for the backend API.

## Demo Video

[Watch the demo walkthrough](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

## Features

- **Horizontal Scrollable Story List** — Circular avatars with gradient rings for unseen stories and gray rings for seen ones
- **Full-Screen Story Viewer** — Instagram-like viewing experience with tap navigation
  - Tap left side to go to previous story
  - Tap right side to go to next story
  - Auto-advances every 5 seconds with animated progress bar
- **Multi-Story Per User** — Each account can have multiple stories that play sequentially
- **Reply Bar** — Message input at the bottom of each story
- **Share Sheet** — Bottom sheet modal showing followers list when tapping "Send"
- **Read/Seen Tracking** — Avatar ring turns gray after all stories from a user are viewed
- **Relative Timestamps** — Shows "15m ago", "2h ago" etc.
- **Follow Graph** — Backend returns only stories from accounts the user follows
- **Loading States** — Spinners while images load, error handling for network failures
- **Smooth Transitions** — Fade animation between stories using React Native Animated API

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native, Expo |
| Backend | Java 17, Spring Boot 3.2 |
| Build | Maven |
| State | React Hooks (useState, useEffect, useRef) |

## Project Structure

```
Story-Feature/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/storyfeature/backend/
│       │   ├── Application.java
│       │   ├── model/
│       │   │   ├── StoryItem.java
│       │   │   └── StoryUser.java
│       │   └── controller/
│       │       ├── StoryController.java
│       │       └── CorsConfig.java
│       └── resources/
│           ├── application.properties
│           ├── json/stories.json
│           └── static/
│               ├── avatars/     # Profile pictures
│               └── stories/     # Story images
└── mobile/
    ├── App.js
    ├── app.json
    ├── components/
    │   ├── StoryList.js         # Horizontal scrollable list
    │   └── StoryViewer.js       # Full-screen viewer
    └── constants/
        └── config.js            # API base URL
```

## Prerequisites

- **Java 17+** installed
- **Maven 3.8+** installed
- **Node.js 18+** installed
- **Expo Go** app on your phone (for mobile testing)

## Running the Backend

```bash
cd backend
mvn spring-boot:run
```

The server starts on `http://localhost:8080`

**API Endpoints:**
- `GET /api/stories` — Returns all followed users with their stories
- `GET /stories/{filename}.jpg` — Serves story images
- `GET /avatars/{filename}.jpg` — Serves avatar images
- `POST /api/stories/{userId}/seen` — Marks stories as seen

## Running the Mobile App

```bash
cd mobile

# Install dependencies (first time only)
npm install

# Start the Expo development server
npx expo start
```

Then:
- **Phone**: Open Expo Go app and scan the QR code
- **Simulator**: Press `i` for iOS or `a` for Android
- **Web**: Run `npx expo start --web`

> **Note**: Update `mobile/constants/config.js` with your machine's local IP if testing on a physical device.

## Configuration

Update the API base URL in `mobile/constants/config.js`:

```js
// For simulator/emulator
const API_BASE_URL = 'http://localhost:8080';

// For physical device on same WiFi
const API_BASE_URL = 'http://192.168.1.x:8080';
```

## Dummy Accounts

The app includes 8 pre-configured accounts that "you" follow:

| Username | Display Name | Stories |
|----------|-------------|---------|
| alex.travels | Alex Morgan | 2 |
| foodie.nina | Nina Patel | 1 |
| jake.fit | Jake Williams | 3 |
| mia.designs | Mia Chen | 1 |
| sam.music | Sam Rivera | 2 |
| olivia.pets | Olivia Brown | 1 |
| dev.kai | Kai Nakamura | 2 |
| emma.yoga | Emma Torres | 1 |

## Screenshots

| Story List | Story Viewer | Share Sheet |
|------------|-------------|-------------|
| *[Story List Screenshot]* | *[Viewer Screenshot]* | *[Share Sheet Screenshot]* |
