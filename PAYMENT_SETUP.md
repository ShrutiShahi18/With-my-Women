# Payment Setup Guide

This guide will help you set up real payment processing with Stripe and PayPal for your "With My Women" application.

## Prerequisites

- A Stripe account (https://stripe.com)
- A PayPal Developer account (https://developer.paypal.com)
- A domain name (for production webhooks)

## 1. Stripe Setup

### Step 1: Create a Stripe Account
1. Go to https://stripe.com and sign up
2. Complete your account verification
3. Navigate to the Dashboard

### Step 2: Get API Keys
1. In your Stripe Dashboard, go to **Developers > API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Add these to your `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

### Step 3: Set Up Webhooks
1. In your Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/payments/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
5. Copy the **Webhook signing secret** (starts with `whsec_`)
6. Add it to your `.env` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### Step 4: Test Stripe Integration
1. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
2. Use any future expiry date and any 3-digit CVC

## 2. PayPal Setup

### Step 1: Create a PayPal Developer Account
1. Go to https://developer.paypal.com
2. Sign up for a developer account
3. Navigate to the Developer Dashboard

### Step 2: Create an App
1. Go to **My Apps & Credentials**
2. Click **Create App**
3. Name your app (e.g., "With My Women")
4. Select **Business** account type

### Step 3: Get API Credentials
1. In your app details, go to **Sandbox** tab
2. Copy the **Client ID** and **Secret**
3. Add these to your `.env` file:
   ```
   PAYPAL_CLIENT_ID=your_client_id_here
   PAYPAL_CLIENT_SECRET=your_client_secret_here
   ```

### Step 4: Set Up Webhooks (Optional)
1. Go to **Webhooks** in your PayPal Developer Dashboard
2. Add webhook URL: `https://yourdomain.com/api/payments/paypal-webhook`
3. Select events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `BILLING.SUBSCRIPTION.CANCELLED`

### Step 5: Test PayPal Integration
1. Use PayPal's sandbox accounts:
   - Email: `sb-1234567890@business.example.com`
   - Password: `test123`

## 3. Environment Configuration

Copy the example environment file and update it with your real credentials:

```bash
cp server/env.example server/.env
```

Update the `.env` file with your actual API keys and secrets.

## 4. Production Setup

### For Production, you'll need to:

1. **Switch to Live Mode**:
   - Stripe: Use live keys (start with `sk_live_` and `pk_live_`)
   - PayPal: Use production credentials from your live PayPal account

2. **Update Webhook URLs**:
   - Use your actual domain instead of localhost
   - Ensure HTTPS is enabled

3. **Security Considerations**:
   - Never commit `.env` files to version control
   - Use environment variables in production hosting
   - Enable webhook signature verification
   - Use strong JWT secrets

## 5. Testing the Integration

### Test Flow:
1. Start your server: `npm run dev` (in server directory)
2. Start your client: `npm run dev` (in client directory)
3. Register/login to your application
4. Go to the Premium page
5. Select a tier and payment method
6. Complete a test payment
7. Verify the user's premium status is updated

### Expected Behavior:
- Stripe: User is redirected to Stripe Checkout, then back to your app
- PayPal: User is redirected to PayPal, then back to your app
- Both: User's premium status should be updated automatically
- Webhooks should handle the payment confirmation

## 6. Troubleshooting

### Common Issues:

1. **Webhook not receiving events**:
   - Check webhook URL is accessible
   - Verify webhook secret is correct
   - Check server logs for errors

2. **Payment not completing**:
   - Verify API keys are correct
   - Check browser console for errors
   - Ensure user is authenticated

3. **User not getting premium access**:
   - Check webhook is processing correctly
   - Verify database connection
   - Check user ID in webhook metadata

### Debug Mode:
Add this to your server to see detailed payment logs:
```javascript
console.log('Payment event received:', event.type);
console.log('Payment data:', event.data.object);
```

## 7. Security Best Practices

1. **Always verify webhook signatures**
2. **Use HTTPS in production**
3. **Validate payment amounts server-side**
4. **Store sensitive data securely**
5. **Regularly rotate API keys**
6. **Monitor payment logs for suspicious activity**

## 8. Going Live

When ready for production:

1. Switch to live API keys
2. Update webhook URLs to production domain
3. Test with small amounts first
4. Set up monitoring and alerts
5. Have a plan for handling payment disputes
6. Ensure compliance with local payment regulations

## Support

- Stripe Documentation: https://stripe.com/docs
- PayPal Documentation: https://developer.paypal.com/docs
- For application-specific issues, check the server logs and browser console 