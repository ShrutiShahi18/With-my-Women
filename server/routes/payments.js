const express = require('express');
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}
const paypal = require('@paypal/paypal-server-sdk');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');

// PayPal environment setup
let paypalClient = null;
if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
  const paypalEnv = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
  paypalClient = new paypal.core.PayPalHttpClient(paypalEnv);
}

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Membership',
    price: 499, // $4.99 in cents
    features: ['Private chat room', 'Premium badge', 'Early access']
  },
  premium: {
    name: 'Premium Membership', 
    price: 999, // $9.99 in cents
    features: ['All Basic features', 'Priority support', 'Exclusive content', 'Analytics', 'Custom themes', 'Offline reading']
  },
  vip: {
    name: 'VIP Membership',
    price: 1999, // $19.99 in cents
    features: ['All Premium features', 'Mentorship program', 'Advanced search', 'Book club', 'Exclusive webinars']
  }
};

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe checkout session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' });
    }

    const { tier } = req.body;
    
    if (!SUBSCRIPTION_PLANS[tier]) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }

    const plan = SUBSCRIPTION_PLANS[tier];
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.features.join(', '),
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/premium?canceled=true`,
      metadata: {
        userId: req.user.id,
        tier: tier,
      },
      customer_email: req.user.email,
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// @route   POST /api/payments/create-paypal-order
// @desc    Create PayPal order
router.post('/create-paypal-order', auth, async (req, res) => {
  try {
    if (!paypalClient) {
      return res.status(500).json({ error: 'PayPal is not configured. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to your environment variables.' });
    }

    const { tier } = req.body;
    
    if (!SUBSCRIPTION_PLANS[tier]) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }

    const plan = SUBSCRIPTION_PLANS[tier];
    const amount = (plan.price / 100).toFixed(2);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
          description: plan.name,
          custom_id: `${req.user.id}_${tier}`,
        },
      ],
      application_context: {
        brand_name: 'With My Women',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/premium?success=true&order_id={order_id}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/premium?canceled=true`,
      },
    });

    const order = await paypalClient.execute(request);
    
    res.json({ 
      orderId: order.result.id,
      approvalUrl: order.result.links.find(link => link.rel === 'approve').href 
    });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// @route   POST /api/payments/stripe-webhook
// @desc    Handle Stripe webhook events
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook secret not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleStripePaymentSuccess(session);
        break;
      
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handleStripeSubscriptionRenewal(invoice);
        break;
      
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleStripeSubscriptionCancellation(subscription);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// @route   POST /api/payments/paypal-webhook
// @desc    Handle PayPal webhook events
router.post('/paypal-webhook', async (req, res) => {
  try {
    const event = req.body;
    
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePayPalPaymentSuccess(event.resource);
        break;
      
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handlePayPalSubscriptionCancellation(event.resource);
        break;
      
      default:
        console.log(`Unhandled PayPal event: ${event.event_type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook processing error:', error);
    res.status(500).json({ error: 'PayPal webhook processing failed' });
  }
});

// @route   POST /api/payments/capture-paypal-order
// @desc    Capture PayPal payment after approval
router.post('/capture-paypal-order', async (req, res) => {
  try {
    if (!paypalClient) {
      return res.status(500).json({ error: 'PayPal is not configured. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to your environment variables.' });
    }

    const { orderId } = req.body;
    
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await paypalClient.execute(request);
    
    if (capture.result.status === 'COMPLETED') {
      await handlePayPalPaymentSuccess(capture.result);
      res.json({ success: true, capture: capture.result });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
});

// Helper functions
async function handleStripePaymentSuccess(session) {
  try {
    const { userId, tier } = session.metadata;
    const user = await User.findById(userId);
    
    if (!user) {
      console.error('User not found for payment:', userId);
      return;
    }

    // Set premium status and expiration (1 month from now)
    const premiumExpires = new Date();
    premiumExpires.setMonth(premiumExpires.getMonth() + 1);
    
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumTier: tier,
      premiumExpires: premiumExpires,
    });

    console.log(`User ${userId} upgraded to ${tier} tier via Stripe`);
  } catch (error) {
    console.error('Error handling Stripe payment success:', error);
  }
}

async function handlePayPalPaymentSuccess(capture) {
  try {
    // Extract user ID and tier from custom_id
    const customId = capture.custom_id;
    const [userId, tier] = customId.split('_');
    
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for PayPal payment:', userId);
      return;
    }

    // Set premium status and expiration (1 month from now)
    const premiumExpires = new Date();
    premiumExpires.setMonth(premiumExpires.getMonth() + 1);
    
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumTier: tier,
      premiumExpires: premiumExpires,
    });

    console.log(`User ${userId} upgraded to ${tier} tier via PayPal`);
  } catch (error) {
    console.error('Error handling PayPal payment success:', error);
  }
}

async function handleStripeSubscriptionRenewal(invoice) {
  try {
    const customerId = invoice.customer;
    // Find user by Stripe customer ID and extend their premium
    const user = await User.findOne({ stripeCustomerId: customerId });
    
    if (user) {
      const premiumExpires = new Date();
      premiumExpires.setMonth(premiumExpires.getMonth() + 1);
      
      await User.findByIdAndUpdate(user._id, {
        premiumExpires: premiumExpires,
      });
      
      console.log(`Renewed premium for user ${user._id}`);
    }
  } catch (error) {
    console.error('Error handling subscription renewal:', error);
  }
}

async function handleStripeSubscriptionCancellation(subscription) {
  try {
    const customerId = subscription.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        isPremium: false,
        premiumTier: 'none',
        premiumExpires: null,
      });
      
      console.log(`Cancelled premium for user ${user._id}`);
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handlePayPalSubscriptionCancellation(subscription) {
  try {
    const customId = subscription.custom_id;
    const [userId] = customId.split('_');
    
    await User.findByIdAndUpdate(userId, {
      isPremium: false,
      premiumTier: 'none',
      premiumExpires: null,
    });
    
    console.log(`Cancelled premium for user ${userId}`);
  } catch (error) {
    console.error('Error handling PayPal subscription cancellation:', error);
  }
}

module.exports = router; 