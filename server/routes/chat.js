const express = require('express');
const router = express.Router();

// Mock responses for the chatbot
const mockReplies = [
  "I'm here to help! How can I support you today?",
  "That's a great question! Let's explore it together.",
  "Remember, your voice matters.",
  "Empowerment starts with a single step. What's on your mind?",
  "I'm always here to listen and provide guidance.",
  "Every story is important. Tell me more!",
  "Let's work through this together.",
  "You are not alone. Many people have similar questions.",
  "Would you like some resources or just to chat?",
  "Thank you for sharing. How can I assist further?"
];

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  // Pick a random mock reply
  const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
  res.json({ reply });
});

module.exports = router; 