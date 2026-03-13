// api/chat.js — Groq AI endpoint
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({error:'Method not allowed'}); return; }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) { res.status(500).json({text:'AI nie skonfigurowany'}); return; }

  try {
    const { message, conversationHistory = [], scenario = 'salary', messageCount = 0 } = req.body;
    const PROMPTS = {
      salary:      'Jesteś wymagającym dyrektorem HR w rozmowie o podwyżce. Bądź sceptyczny. TYLKO PO POLSKU. Max 3 zdania.',
      promotion:   'Jesteś sceptycznym CEO w rozmowie o awansie. TYLKO PO POLSKU. Max 3 zdania.',
      recruitment: 'Jesteś rekruterem prowadzącym rozmowę kwalifikacyjną. TYLKO PO POLSKU. Max 3 zdania.',
      client:      'Jesteś trudnym klientem negocjującym warunki. TYLKO PO POLSKU. Max 3 zdania.',
    };
    const isEval = messageCount >= 6;
    const systemPrompt = isEval
      ? 'Oceń tę rozmowę. Odpowiedz TYLKO w JSON: {"score":7,"positives":["..."],"improvements":["..."],"summary":"..."}'
      : (PROMPTS[scenario] || PROMPTS.salary);

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {'Content-Type':'application/json','Authorization':'Bearer ' + GROQ_KEY},
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{role:'system',content:systemPrompt}, ...conversationHistory.slice(-8), {role:'user',content:message}],
        max_tokens: 300, temperature: 0.8
      })
    });
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content || '';
    if (isEval) {
      try {
        const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || text);
        res.json({...parsed, isEvaluation: true});
      } catch { res.json({text, isEvaluation: true, score: 7}); }
    } else {
      res.json({text});
    }
  } catch(e) {
    res.status(500).json({text: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.'});
  }
};
