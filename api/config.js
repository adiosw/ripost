module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.json({
    su: process.env.SUPABASE_URL  || '',
    sa: process.env.SUPABASE_ANON || '',
  });
};
