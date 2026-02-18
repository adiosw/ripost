# ✅ Complete Setup Checklist - Ripost

Use this checklist to ensure your Ripost installation is complete and production-ready.

## 📋 Pre-Launch Checklist

### 1️⃣ Initial Setup

- [ ] Unzip `ripost.zip` to your local machine
- [ ] Read `QUICKSTART.md` for overview
- [ ] Read `README.md` for technical details
- [ ] Review `config.js` for customization options

### 2️⃣ Configuration

- [ ] Edit `config.js`:
  - [ ] Update `app.domain` to your actual domain
  - [ ] Update `app.email` to your contact email
  - [ ] Review and adjust package prices if needed
  - [ ] Update testimonials with real ones (or remove)
  - [ ] Update FAQ if needed
  - [ ] Set `stats.showStats` to `false` if you don't have real data yet

### 3️⃣ Remove Test Data

- [ ] Open `assets/js/app.js`
- [ ] Find the `TEST_CODES` object (around line 15)
- [ ] Comment out or delete the entire object:
  ```javascript
  // const TEST_CODES = {
  //     'DEMO-2026': { type: 'START', simulations: 1 },
  //     'PRO-49': { type: 'PRO', simulations: 5 },
  //     'UNLIMITED-99': { type: 'UNLIMITED', simulations: -1, expires: Date.now() + 30*24*60*60*1000 }
  // };
  ```

### 4️⃣ API Keys

- [ ] **Groq API Key**:
  - [ ] Sign up at [console.groq.com](https://console.groq.com)
  - [ ] Generate API key (starts with `gsk_`)
  - [ ] Save it securely (you'll need it for Vercel)

- [ ] **Stripe Keys** (if using Stripe):
  - [ ] Sign up at [stripe.com](https://stripe.com)
  - [ ] Get publishable key (`pk_test_`)
  - [ ] Get secret key (`sk_test_`)
  - [ ] Save both securely

### 5️⃣ GitHub Setup

- [ ] Create new repository on GitHub
- [ ] Initialize git in your local project:
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Ripost v1.0"
  ```
- [ ] Connect to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR-USERNAME/ripost.git
  git push -u origin main
  ```

### 6️⃣ Vercel Deployment

- [ ] Sign up at [vercel.com](https://vercel.com) with GitHub
- [ ] Import your GitHub repository
- [ ] Configure project:
  - [ ] Framework Preset: **Other**
  - [ ] Build Command: (leave empty)
  - [ ] Output Directory: (leave empty)
- [ ] Add Environment Variables:
  - [ ] `GROQ_API_KEY` = your Groq key
  - [ ] (If Stripe) `STRIPE_SECRET_KEY` = your Stripe secret key
  - [ ] (If Stripe) `STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key
- [ ] Deploy project
- [ ] Wait for deployment to complete
- [ ] Visit your site (e.g., `ripost.vercel.app`)

### 7️⃣ Payment Integration

#### Option A: Naffy (Simpler)

- [ ] Create account at [naffy.io](https://www.naffy.io)
- [ ] Add 3 products:
  - [ ] **Ripost START** - 29 PLN
  - [ ] **Ripost PRO** - 49 PLN
  - [ ] **Ripost UNLIMITED** - 99 PLN
- [ ] Configure code formats:
  - [ ] START: `START-XXXXXX` (6 digits)
  - [ ] PRO: `PRO-XX` (2 digits)
  - [ ] UNLIMITED: `UNLIMITED-XX` (2 digits)
- [ ] Copy product URLs
- [ ] Update links in `index.html` (search for "naffy.io")

#### Option B: Stripe (More features)

- [ ] Follow instructions in `STRIPE-SETUP.md`
- [ ] Create 3 products in Stripe Dashboard
- [ ] Copy Price IDs
- [ ] Update `config.js` with Price IDs
- [ ] Set up webhook endpoint
- [ ] Test with test cards
- [ ] Configure email service (SendGrid/Mailgun/Postmark)

### 8️⃣ Testing

#### Basic Functionality
- [ ] Landing page loads correctly
- [ ] All sections display properly
- [ ] Navigation works (smooth scroll)
- [ ] Hamburger menu works on mobile
- [ ] FAQ accordion works
- [ ] Video demo plays

#### Application
- [ ] Access code input works
- [ ] Test code activates successfully (use real code or leave test codes temporarily)
- [ ] Scenario selection works
- [ ] Chat interface displays correctly
- [ ] Can send messages
- [ ] AI responds (check Groq API is working)
- [ ] Evaluation displays after 2-3 exchanges
- [ ] Simulation counter decreases
- [ ] Can't use more simulations than allowed

#### Mobile Testing
- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Page doesn't overflow horizontally
- [ ] All buttons are tappable
- [ ] Text is readable
- [ ] Forms work correctly
- [ ] PWA can be installed to home screen

#### Payment Testing
- [ ] Click "Kup teraz" button
- [ ] Redirects to payment page (Naffy or Stripe)
- [ ] Complete test payment
- [ ] Receive access code (via email or on success page)
- [ ] Code works in application

### 9️⃣ Content Updates

- [ ] Update meta tags in `index.html`:
  - [ ] `<title>` tag
  - [ ] `<meta name="description">`
  - [ ] Open Graph tags
- [ ] Update hero section text if needed
- [ ] Replace demo video with your own (optional)
- [ ] Update testimonials with real ones
- [ ] Add your logo/brand colors in CSS
- [ ] Update footer links
- [ ] Add Regulamin (Terms of Service) page
- [ ] Add Polityka Prywatności (Privacy Policy) page

### 🔟 Analytics (Optional)

- [ ] **Google Analytics**:
  - [ ] Create account at [analytics.google.com](https://analytics.google.com)
  - [ ] Get tracking ID (G-XXXXXXXXXX)
  - [ ] Add to `config.js`
  - [ ] Add tracking code to `index.html` and `app.html`

- [ ] **Plausible** (privacy-friendly alternative):
  - [ ] Create account at [plausible.io](https://plausible.io)
  - [ ] Add domain
  - [ ] Add script to pages

### 1️⃣1️⃣ SEO

- [ ] Create `robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://your-domain.com/sitemap.xml
  ```
- [ ] Create `sitemap.xml`:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://your-domain.com/</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://your-domain.com/app.html</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  </urlset>
  ```
- [ ] Submit sitemap to Google Search Console
- [ ] Verify domain ownership

### 1️⃣2️⃣ Custom Domain (Optional)

- [ ] Purchase domain (e.g., `ripost.pl`)
- [ ] In Vercel: Settings → Domains → Add
- [ ] Add DNS records from Vercel to your domain provider:
  - [ ] A record: `@` → `76.76.21.21`
  - [ ] CNAME record: `www` → `cname.vercel-dns.com`
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Update all URLs in code to use new domain

### 1️⃣3️⃣ Email Setup (If using Stripe)

- [ ] Choose email service:
  - [ ] SendGrid (recommended, 100 free emails/day)
  - [ ] Mailgun (first 5,000 emails free)
  - [ ] Postmark (100 free emails/month)
- [ ] Create account and get API key
- [ ] Add API key to Vercel environment variables
- [ ] Update `api/stripe-webhook.js` with email code
- [ ] Test email delivery
- [ ] Customize `email-template.html` with your branding

### 1️⃣4️⃣ Legal Pages

- [ ] Create Terms of Service page
- [ ] Create Privacy Policy page (GDPR compliant)
- [ ] Add Cookie notice if tracking users
- [ ] Link from footer
- [ ] Update refund policy in FAQ

### 1️⃣5️⃣ Monitoring

- [ ] Set up Vercel Analytics (free, automatic)
- [ ] Monitor function logs:
  - [ ] Vercel Dashboard → Deployments → Functions
  - [ ] Check for errors
- [ ] Set up error alerts (optional):
  - [ ] Sentry
  - [ ] LogRocket
  - [ ] Vercel Monitoring

### 1️⃣6️⃣ Performance

- [ ] Test page speed: [pagespeed.web.dev](https://pagespeed.web.dev)
- [ ] Optimize if needed:
  - [ ] Compress images
  - [ ] Minify CSS/JS (Vercel does this automatically)
  - [ ] Enable caching
- [ ] Test on slow 3G connection
- [ ] PWA works offline

### 1️⃣7️⃣ Security

- [ ] HTTPS enabled (Vercel provides this automatically) ✅
- [ ] Environment variables are secret ✅
- [ ] No API keys in frontend code ✅
- [ ] Webhook signatures verified ✅
- [ ] CORS properly configured ✅
- [ ] Rate limiting (optional, for high traffic)
- [ ] DDoS protection (Vercel provides this) ✅

### 1️⃣8️⃣ Backup

- [ ] Repository is on GitHub ✅
- [ ] Export Vercel environment variables
- [ ] Save access to all services:
  - [ ] Vercel credentials
  - [ ] Groq API key
  - [ ] Stripe/Naffy credentials
  - [ ] Email service credentials
  - [ ] Domain registrar access

### 1️⃣9️⃣ Launch Preparation

- [ ] Soft launch to friends/family
- [ ] Get initial feedback
- [ ] Fix any critical bugs
- [ ] Create launch announcement
- [ ] Prepare social media posts
- [ ] Set up customer support email/system

### 2️⃣0️⃣ Go Live!

- [ ] **Switch Stripe to live mode** (if using Stripe):
  - [ ] Update API keys to live keys
  - [ ] Update webhook to production URL
  - [ ] Test with small real payment
- [ ] Announce launch
- [ ] Monitor closely for first 24 hours
- [ ] Respond to first customers quickly
- [ ] Track conversion rates

## 🎯 Post-Launch

### Week 1
- [ ] Monitor user feedback
- [ ] Fix urgent bugs
- [ ] Track conversions
- [ ] Respond to support emails
- [ ] Monitor API usage (Groq limits)

### Week 2-4
- [ ] Analyze user behavior
- [ ] A/B test pricing/copy
- [ ] Collect testimonials
- [ ] Add new features if needed
- [ ] Marketing campaigns

## 📊 Success Metrics

Track these KPIs:
- [ ] Landing page visitors
- [ ] Conversion rate (visitors → purchases)
- [ ] Activation rate (purchases → used code)
- [ ] Completion rate (activated → finished simulation)
- [ ] Average rating given by users
- [ ] Customer satisfaction (NPS)
- [ ] Revenue per package
- [ ] Churn rate (for UNLIMITED)

## 🆘 Troubleshooting

If something goes wrong:

1. **Check Vercel logs**: Deployments → Functions → Logs
2. **Check browser console**: F12 → Console tab
3. **Test API directly**: Use Postman/Insomnia
4. **Check environment variables**: Vercel → Settings → Environment Variables
5. **Redeploy**: Vercel → Deployments → Redeploy

## 📞 Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Groq Docs**: [console.groq.com/docs](https://console.groq.com/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Naffy Support**: [support.naffy.io](https://support.naffy.io)

---

## ✨ You're Ready!

Once all checkboxes are ✅, you're ready to launch! 

Remember:
- Start small and iterate
- Listen to user feedback
- Monitor metrics
- Keep improving

Good luck! 🚀
