require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const paypal = require('@paypal/paypal-server-sdk');

// PayPal environment setup (sandbox for now)
let paypalClient = null;
if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
  const paypalEnv = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
  paypalClient = new paypal.core.PayPalHttpClient(paypalEnv);
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://with-my-women-frontend.onrender.com'
}));
app.options('*', cors({
  origin: 'https://with-my-women-frontend.onrender.com'
}));
console.log('CORS config loaded for https://with-my-women-frontend.onrender.com');
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const paymentRoutes = require('./routes/payments');
const chatRoutes = require('./routes/chat');

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);

// Special handling for Stripe webhooks (needs raw body)
app.use('/api/payments/stripe-webhook', express.raw({ type: 'application/json' }));

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to With my Women! Blog API');
});
