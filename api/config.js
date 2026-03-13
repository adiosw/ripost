// api/config.js — zwraca publiczne klucze do frontendu
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.json({
    sp: process.env.STRIPE_PK     || '',
    p1: process.env.PRICE_29      || '',
    p2: process.env.PRICE_49      || '',
    p3: process.env.PRICE_99      || '',
    su: process.env.SUPABASE_URL  || '',
    sa: process.env.SUPABASE_ANON || '',
  });
};
