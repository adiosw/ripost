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
      salary: 'Jesteś Pawłem Kowalskim, dyrektorem HR z 15-letnim doświadczeniem. Jesteś uprzejmy ale twardy jak skała. Nigdy nie dajesz podwyżki od razu — zawsze kwestionujesz kwotę, pytasz o dowody, porównujesz do rynku i innych w teamie. Mówisz naturalnym polskim, bez korporacyjnego bełkotu. Max 2-3 zdania. Nigdy nie chwal za bardzo — maximum "to interesujące".',
      promotion: 'Jesteś Agnieszką, CEO małej firmy technologicznej. Awansujesz rzadko i tylko gdy masz pewność. Kwestionujesz każdy argument — czy kandydat naprawdę jest gotowy? Czy ma plan? Czy poradzi sobie z trudnymi ludźmi? Mówisz po polsku, naturalnie. Max 2-3 zdania. Bądź sceptyczna.',
      recruitment: 'Jesteś rekruterem z budżetem o 20% niższym niż kandydat oczekuje. Twoja taktyka: zaniżaj, testuj elastyczność, porównuj do innych kandydatów, pytaj o deadline decyzji. Mówisz po polsku, profesjonalnie ale naciskasz. Max 2-3 zdania.',
    };

    const isEval = messageCount >= 6;

    const systemPrompt = isEval
      ? 'Oceń tę rozmowę negocjacyjną jak surowy ale sprawiedliwy coach. BĄDŹ SZCZERY — jeśli ktoś był zbyt ugrzeczniony, uległy lub nie miał konkretnych danych, daj 4-6/10. Ocena 9-10 TYLKO za naprawdę świetną robotę. Odpowiedz WYŁĄCZNIE w JSON: {"score":6.5,"positives":["konkretny plus 1","konkretny plus 2"],"improvements":["co poprawić z przykładem jak","drugie co poprawić"],"summary":"2-3 zdania po polsku, szczere","next_focus":"jedna rzecz do ćwiczenia następnym razem"}'
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
        model: 'llama-3.3-70b-versatile',
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
