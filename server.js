const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase SDK Initialization
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, update, get } = require("firebase/database");

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzxSL6N7FOXC8FuM6v11qJRODLIC4TJXE",
  authDomain: "app-telegram-f4101.firebaseapp.com",
  databaseURL: "https://app-telegram-f4101-default-rtdb.firebaseio.com",
  projectId: "app-telegram-f4101",
  storageBucket: "app-telegram-f4101.firebasestorage.app",
  messagingSenderId: "67113105635",
  appId: "1:67113105635:web:2d6049641a5b6ebca6edd6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to serve the app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint for handling Telegram user data
app.post("/telegram-user", async (req, res) => {
  const user = req.body;

  if (!user || !user.id) {
    return res.status(400).json({ error: "Invalid Telegram user data" });
  }

  // Check if user already exists in the Firebase database
  const userRef = ref(db, `users/${user.id}`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) {
    // If user doesn't exist, create a new record
    const userId = `guestuser${Math.floor(Math.random() * 10000)}`;
    await set(ref(db, `users/${user.id}`), {
      id: user.id,
      name: user.first_name,
      username: user.username,
      chat_id: user.id,
      premium: user.is_premium ? 'Yes' : 'No',
      abcoin: 0,  // Initial AB Coin
      user_name: userId  // If it's a new guest user
    });
  }

  res.json({
    message: "User data received successfully",
    user,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
