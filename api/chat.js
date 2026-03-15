module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const GROQ_KEY = process.env.GROQ_API_KEY || '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';

  try {
    const { message, conversationHistory = [], scenario = 'salary', messageCount = 0 } = req.body;

    const PROMPTS = {
      salary:      'Jesteś wymagającym dyrektorem HR w rozmowie o podwyżkę. Bądź sceptyczny, pytaj o konkretne liczby i wyniki. Odpowiadaj TYLKO po polsku. Maksymalnie 3 zdania.',
      promotion:   'Jesteś sceptycznym CEO rozmawiającym o awansie pracownika. Kwestionuj gotowość kandydata. Odpowiadaj TYLKO po polsku. Maksymalnie 3 zdania.',
      recruitment: 'Jesteś rekruterem z ograniczonym budżetem negocjującym wynagrodzenie. Próbuj obniżyć oczekiwania. Odpowiadaj TYLKO po polsku. Maksymalnie 3 zdania.',
      client:      'Jesteś trudnym klientem który zawsze chce rabatu i porównuje do konkurencji. Odpowiadaj TYLKO po polsku. Maksymalnie 3 zdania.',
    };

    const isEval = messageCount >= 6;

    const systemPrompt = isEval
      ? 'Oceń tę rozmowę negocjacyjną. Odpowiedz WYŁĄCZNIE w JSON bez żadnego dodatkowego tekstu: {"score":7,"positives":["przykład1","przykład2"],"improvements":["przykład1","przykład2"],"summary":"krótkie podsumowanie po polsku"}'
      : (PROMPTS[scenario] || PROMPTS.salary);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8),
      { role: 'user', content: message }
    ];

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages,
        max_tokens: 300,
        temperature: 0.8
      })
    });

    const data = await r.json();

    if (!r.ok) {
      console.error('Groq error:', data);
      res.status(500).json({ text: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.' });
      return;
    }

    const text = data.choices?.[0]?.message?.content || '';

    if (isEval) {
      try {
        const match = text.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(match ? match[0] : text);
        res.json({ ...parsed, isEvaluation: true });
      } catch {
        res.json({ score: 7, positives: ['Dobra próba'], improvements: ['Ćwicz dalej'], summary: text, isEvaluation: true });
      }
    } else {
      res.json({ text });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ text: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.' });
  }
};
