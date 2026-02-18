# 💳 Stripe Integration Guide

## Overview

Ripost includes full Stripe integration as an alternative to Naffy. Use Stripe if you want:
- International payments (credit cards worldwide)
- More payment methods (BLIK, P24, Apple Pay, Google Pay)
- Automatic invoice generation
- Better analytics

## 📋 Prerequisites

1. Stripe account: [stripe.com](https://stripe.com)
2. Verified business (required for live mode)
3. Node.js dependencies installed

## 🚀 Setup Steps

### Step 1: Get Stripe API Keys

1. Log in to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Click on **Developers** → **API keys**
3. Copy both keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### Step 2: Create Products

1. Go to **Products** → **Add product**
2. Create 3 products:

**Product 1: Ripost START**
- Name: Ripost START
- Price: 29 PLN
- Recurring: One-time
- Copy the **Price ID** (starts with `price_`)

**Product 2: Ripost PRO** ⭐
- Name: Ripost PRO  
- Price: 49 PLN
- Recurring: One-time
- Copy the **Price ID**

**Product 3: Ripost UNLIMITED** 🔥
- Name: Ripost UNLIMITED
- Price: 99 PLN
- Recurring: One-time
- Copy the **Price ID**

### Step 3: Configure Vercel Environment Variables

Add these in Vercel → Settings → Environment Variables:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=(get this in step 5)
```

### Step 4: Update index.html

Replace the Naffy links with Stripe buttons:

```html
<!-- In the pricing section -->
<button class="btn-pricing" onclick="checkout('price_START_ID', 'START')">
    Kup teraz
</button>

<button class="btn-pricing btn-pricing-pro" onclick="checkout('price_PRO_ID', 'PRO')">
    Kup teraz
</button>

<button class="btn-pricing btn-pricing-unlimited" onclick="checkout('price_UNLIMITED_ID', 'UNLIMITED')">
    Kup teraz
</button>
```

Add this script before closing `</body>`:

```html
<script src="https://js.stripe.com/v3/"></script>
<script>
const stripe = Stripe('pk_test_your_publishable_key_here');

async function checkout(priceId, packageType) {
    try {
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, packageType })
        });
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.sessionId
        });
        
        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Błąd płatności. Spróbuj ponownie.');
    }
}
</script>
```

### Step 5: Setup Webhook

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://your-domain.vercel.app/api/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to Vercel: `STRIPE_WEBHOOK_SECRET=whsec_...`

### Step 6: Install Dependencies

Update `package.json`:

```json
{
  "dependencies": {
    "node-fetch": "^2.6.7",
    "stripe": "^14.11.0"
  }
}
```

Run:
```bash
npm install
```

### Step 7: Deploy

```bash
git add .
git commit -m "Add Stripe integration"
git push
```

Vercel will automatically redeploy.

## 🧪 Testing

### Test Mode

Use Stripe test cards:

**Successful payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Payment fails:**
- Card: `4000 0000 0000 0002`

**Requires 3D Secure:**
- Card: `4000 0027 6000 3184`

### Test the Flow

1. Click "Kup teraz" on landing page
2. Enter test card details
3. Complete payment
4. You should see:
   - Redirect to `success.html`
   - Access code displayed
   - Webhook triggered (check Stripe Dashboard → Developers → Events)

### Check Logs

Monitor webhook events:
```bash
# In Vercel Dashboard
Deployments → Functions → stripe-webhook → Logs
```

## 📧 Email Integration

### Option 1: SendGrid (Recommended)

1. Create account: [sendgrid.com](https://sendgrid.com)
2. Get API key
3. Add to Vercel: `SENDGRID_API_KEY=SG.xxx`
4. Install: `npm install @sendgrid/mail`
5. Uncomment email code in `api/stripe-webhook.js`

### Option 2: Mailgun

1. Create account: [mailgun.com](https://mailgun.com)
2. Get API key and domain
3. Add to Vercel:
   ```
   MAILGUN_API_KEY=xxx
   MAILGUN_DOMAIN=xxx
   ```
4. Install: `npm install mailgun.js`

### Option 3: Postmark

1. Create account: [postmarkapp.com](https://postmarkapp.com)
2. Get Server Token
3. Add to Vercel: `POSTMARK_SERVER_TOKEN=xxx`
4. Install: `npm install postmark`

## 🔒 Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify webhook signatures** (already done in `stripe-webhook.js`)
3. **Use HTTPS** (Vercel provides this automatically)
4. **Validate price IDs** server-side before creating checkout
5. **Store access codes** in database (optional but recommended)

## 💾 Optional: Database Integration

For production, consider storing codes in database:

### Vercel Postgres (Recommended)

```bash
npm install @vercel/postgres
```

Create table:
```sql
CREATE TABLE access_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  package_type VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

Update `stripe-webhook.js`:
```javascript
const { sql } = require('@vercel/postgres');

// After generating code
await sql`
  INSERT INTO access_codes (code, package_type, email, expires_at)
  VALUES (${code}, ${packageType}, ${customerEmail}, ${expiresAt})
`;
```

## 🌍 International Payments

Enable more payment methods in Stripe Dashboard:

1. Settings → Payment methods
2. Enable:
   - ✅ Cards (Visa, Mastercard, Amex)
   - ✅ Apple Pay
   - ✅ Google Pay
   - ✅ BLIK (Poland)
   - ✅ Przelewy24 (Poland)
   - ✅ SEPA Direct Debit (Europe)

Update checkout creation:
```javascript
payment_method_types: ['card', 'blik', 'p24', 'sepa_debit'],
```

## 📊 Analytics

Track conversions in Stripe Dashboard:
- Payments → Overview
- Reports → Revenue
- Customers → Overview

## 🚨 Troubleshooting

### Webhook not triggering

1. Check webhook URL is correct
2. Verify signing secret matches
3. Check Stripe event logs
4. Check Vercel function logs

### Payment succeeds but no code

1. Check webhook is configured
2. Verify email service is working
3. Check function logs for errors
4. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   stripe trigger checkout.session.completed
   ```

### CORS errors

Make sure `create-checkout.js` has CORS headers:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

## 📈 Going Live

### Checklist

- [ ] Switch to live API keys (pk_live_, sk_live_)
- [ ] Update webhook endpoint to production URL
- [ ] Test with real card (small amount)
- [ ] Verify email is sent
- [ ] Check code is generated correctly
- [ ] Test on mobile device
- [ ] Monitor first few transactions

### Live Mode API Keys

1. Stripe Dashboard → Developers → API keys
2. Toggle **View live data**
3. Copy **live** keys
4. Update Vercel environment variables
5. Redeploy

## 💰 Pricing

Stripe fees (Poland):
- EU cards: 1.4% + 1 PLN
- Non-EU cards: 2.9% + 1 PLN
- BLIK/P24: 1.6% + 1 PLN

Example: 49 PLN package = 48.31 PLN after fees (1.4% + 1 PLN)

## 🆘 Support

- Stripe Docs: [stripe.com/docs](https://stripe.com/docs)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Test your integration: [stripe.com/docs/testing](https://stripe.com/docs/testing)

---

That's it! Your Stripe integration is ready. 🎉
