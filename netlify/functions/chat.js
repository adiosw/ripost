/**
 * Ripost AI – Netlify Function: /api/chat
 * Groq API z modelem LLaMA 3.1 70B
 */
const GROQ_KEY = process.env.GROQ_API_KEY || process.env.GROQ_API_KEY || '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const SYSTEM_PROMPTS = {
  salary:    'Jesteś wymagającym dyrektorem HR w rozmowie o podwyżce. Bądź sceptyczny, zadawaj trudne pytania, nie odpuszczaj. TYLKO PO POLSKU. Odpowiedź max 3 zdania.',
  promotion: 'Jesteś sceptycznym CEO rozmawiającym z pracownikiem o awansie. Kwestionuj gotowość i wyniki. TYLKO PO POLSKU. Max 3 zdania.',
  recruitment: 'Jesteś doświadczonym rekruterem prowadzącym rozmowę kwalifikacyjną. Zadawaj trudne pytania STAR. TYLKO PO POLSKU. Max 3 zdania.',
  client:    'Jesteś trudnym klientem negocjującym warunki umowy. Bądź wymagający. TYLKO PO POLSKU. Max 3 zdania.',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({error:'Method not allowed'}) };

  try {
    const { message, conversationHistory=[], scenario='salary', messageCount=0 } = JSON.parse(event.body||'{}');
    const isEval = messageCount >= 6;
    const systemPrompt = isEval
      ? 'Dokonaj oceny tej rozmowy negocjacyjnej. Odpowiedz TYLKO w formacie JSON: {"score":7,"positives":["...","..."],"improvements":["...","..."],"summary":"..."}'
      : (SYSTEM_PROMPTS[scenario] || SYSTEM_PROMPTS.salary);

    const messages = [
      {role:'system', content: systemPrompt},
      ...conversationHistory.slice(-8),
      {role:'user', content: message}
    ];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},
      body: JSON.stringify({model:'llama-3.1-70b-versatile', messages, max_tokens:300, temperature:0.8})
    });

    if (!res.ok) throw new Error(`Groq error: ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';

    if (isEval) {
      try {
        const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0]||text);
        return { statusCode:200, headers:CORS, body: JSON.stringify({...parsed, isEvaluation:true}) };
      } catch { return { statusCode:200, headers:CORS, body: JSON.stringify({text, isEvaluation:true, score:7}) }; }
    }
    return { statusCode:200, headers:CORS, body: JSON.stringify({text}) };
  } catch(err) {
    console.error(err);
    return { statusCode:500, headers:CORS, body: JSON.stringify({text:'Przepraszam, wystąpił błąd. Spróbuj ponownie.', error:err.message}) };
  }
};
