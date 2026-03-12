// api/checkout.js — Vercel Serverless Function
const STRIPE_SECRET = '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';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({error:'Method not allowed'}); return; }

  try {
    const { priceId, mode, successUrl, cancelUrl } = req.body;

    const params = new URLSearchParams();
    params.append('mode', mode);
    params.append('line_items[0][price]', priceId);
    params.append('line_items[0][quantity]', '1');
    params.append('success_url', successUrl || 'https://ripost.vercel.app/app.html?success=1');
    params.append('cancel_url', cancelUrl || 'https://ripost.vercel.app/pricing.html');

    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(STRIPE_SECRET + ':').toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    const session = await r.json();
    if (!r.ok) {
      console.error('Stripe error:', session);
      res.status(400).json({ error: session.error?.message || 'Stripe error' });
      return;
    }
    res.status(200).json({ url: session.url });
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
