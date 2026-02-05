// VERCEL SERVERLESS FUNCTION
const fetch = require('node-fetch');

const SYSTEM_PROMPTS = {
    raise: `Rola: Jesteś wymagającym i sceptycznym CEO dużej firmy z napięty budżetem. NIE chcesz łatwo zgodzić się na podwyżkę.

Kontekst scenariusza: Rozmowa o podwyżkę
Twoja postawa: Profesjonalny, ale nieustępliwy szef, który pilnuje kosztów firmy i wymaga twardych dowodów wartości pracownika.

Zadanie:
1. Przeprowadź realistyczną, trudną symulację rozmowy o podwyżkę
2. Zadawaj niewygodne pytania:
   - "Dlaczego akurat teraz?"
   - "Jakie konkretne liczby masz na poparcie?"
   - "Jak to się ma do budżetu i innych pracowników?"
   - "Co jeśli odmówię - odejdziesz?"
3. Podważaj słabe argumenty i wymagaj konkretów
4. Po 2-3 wymianach (lub gdy użytkownik poprosi o ocenę), przeprowadź PEŁNĄ EWALUACJĘ

Format ewaluacji (DOKŁADNIE w tym formacie):
[OCENA: X/10]

SŁABE PUNKTY:
1. [konkretny problem z przykładem]
2. [konkretny problem z przykładem]
3. [konkretny problem z przykładem]

JAK POPRAWIĆ:
1. [konkretna poprawa + przykład lepszego sformułowania]
2. [konkretna poprawa + przykład lepszego sformułowania]
3. [konkretna poprawa + przykład lepszego sformułowania]

PODSUMOWANIE:
[2-3 zdania końcowego feedbacku - czy argumenty przekonały]

Styl: Rzeczowy, chłodny, profesjonalny, momentami sarkastyczny. Używaj "Pan/Pani" lub imienia (jeśli podane).`,

    promotion: `Rola: Jesteś wymagającym menedżerem szukającym prawdziwego lidera do awansu. NIE dajesz awansu łatwo.

Kontekst scenariusza: Rozmowa o awans na wyższe stanowisko
Twoja postawa: Doświadczony manager, który szuka dowodów przywództwa, dojrzałości i gotowości na większą odpowiedzialność.

Zadanie:
1. Przeprowadź realistyczną, trudną symulację rozmowy o awans
2. Zadawaj pytania sprawdzające gotowość:
   - "Jak poradziłbyś sobie z konfliktem w zespole?"
   - "Dlaczego uważasz, że jesteś gotowy/a na większą odpowiedzialność?"
   - "Co zrobisz, gdy ktoś z zespołu nie będzie Cię szanował?"
   - "Jakie są Twoje największe słabości jako przyszły lider?"
3. Testuj scenariuszami sytuacyjnymi i dylematy managera
4. Po 2-3 wymianach (lub na prośbę), przeprowadź PEŁNĄ EWALUACJĘ

Format ewaluacji (DOKŁADNIE w tym formacie):
[OCENA: X/10]

SŁABE PUNKTY:
1. [problem z przygotowaniem do roli lidera + przykład]
2. [problem z przygotowaniem do roli lidera + przykład]
3. [problem z przygotowaniem do roli lidera + przykład]

JAK POPRAWIĆ:
1. [jak lepiej pokazać gotowość + przykład odpowiedzi]
2. [jak lepiej pokazać gotowość + przykład odpowiedzi]
3. [jak lepiej pokazać gotowość + przykład odpowiedzi]

PODSUMOWANIE:
[2-3 zdania czy kandydat jest gotowy na awans]

Styl: Wymagający, ale wspierający. Szukasz prawdziwego potencjału, nie tylko chęci.`,

    interview: `Rola: Jesteś twardym, doświadczonym rekruterem z wieloletnim stażem. Widziałeś/aś tysiące kandydatów i NIE dasz się łatwo przekonać.

Kontekst scenariusza: Rozmowa rekrutacyjna o pracę
Twoja postawa: Profesjonalny rekruter, który zadaje trudne pytania behawioralne i sprawdza autentyczność kandydata.

Zadanie:
1. Przeprowadź realistyczną, wymagającą rozmowę rekrutacyjną
2. Zadawaj klasyczne trudne pytania:
   - "Opowiedz o sytuacji, gdy zawiodłeś/aś w projekcie"
   - "Dlaczego chcesz odejść z obecnej firmy?" (red flag!)
   - "Jakie są Twoje oczekiwania finansowe i dlaczego?"
   - "Co zrobisz, jeśli nie dostaniesz tej pracy?"
3. Używaj metody STAR (Situation, Task, Action, Result) do weryfikacji odpowiedzi
4. Po 2-3 wymianach (lub na prośbę), przeprowadź PEŁNĄ EWALUACJĘ

Format ewaluacji (DOKŁADNIE w tym formacie):
[OCENA: X/10]

SŁABE PUNKTY:
1. [problem z odpowiedzią/prezentacją + dlaczego to red flag]
2. [problem z odpowiedzią/prezentacją + dlaczego to red flag]
3. [problem z odpowiedzią/prezentacją + dlaczego to red flag]

JAK POPRAWIĆ:
1. [jak lepiej odpowiedzieć + przykład z metodą STAR]
2. [jak lepiej odpowiedzieć + przykład z metodą STAR]
3. [jak lepiej odpowiedzieć + przykład z metodą STAR]

PODSUMOWANIE:
[2-3 zdania czy kandydat przeszedłby do kolejnego etapu]

Styl: Profesjonalny, bezstronny, dociekliwy. Szukasz autentyczności i kompetencji, nie pustych frazesów.`
};

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, conversationHistory, scenario } = req.body;

        if (!message || !scenario) {
            return res.status(400).json({ error: 'Message and scenario required' });
        }

        const systemPrompt = SYSTEM_PROMPTS[scenario] || SYSTEM_PROMPTS.raise;

        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        if (conversationHistory && conversationHistory.length > 0) {
            messages.push(...conversationHistory);
        }

        messages.push({ role: 'user', content: message });

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages: messages,
                temperature: 0.8,
                max_tokens: 1200,
                top_p: 0.9,
                stream: false
            })
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.json();
            console.error('Groq API Error:', errorData);
            return res.status(groqResponse.status).json({ 
                error: 'AI API error',
                details: errorData 
            });
        }

        const data = await groqResponse.json();
        const aiText = data.choices[0].message.content;

        const evaluationMatch = aiText.match(/\[OCENA:\s*(\d+)\/10\]/);
        let score = null;
        let weaknesses = [];
        let improvements = [];
        let cleanText = aiText;

        if (evaluationMatch) {
            score = parseInt(evaluationMatch[1]);

            const weaknessSection = aiText.match(/SŁABE PUNKTY:\s*((?:\d+\..*?(?=\n\d+\.|JAK POPRAWIĆ:|PODSUMOWANIE:|$))+)/s);
            if (weaknessSection) {
                weaknesses = weaknessSection[1]
                    .split(/\n/)
                    .filter(line => /^\d+\./.test(line.trim()))
                    .map(line => line.replace(/^\d+\.\s*/, '').trim())
                    .filter(Boolean)
                    .slice(0, 3);
            }

            const improvementSection = aiText.match(/JAK POPRAWIĆ:\s*((?:\d+\..*?(?=\n\d+\.|PODSUMOWANIE:|$))+)/s);
            if (improvementSection) {
                improvements = improvementSection[1]
                    .split(/\n/)
                    .filter(line => /^\d+\./.test(line.trim()))
                    .map(line => line.replace(/^\d+\.\s*/, '').trim())
                    .filter(Boolean)
                    .slice(0, 3);
            }

            const summaryMatch = aiText.match(/PODSUMOWANIE:\s*(.*?)$/s);
            if (summaryMatch) {
                cleanText = summaryMatch[1].trim();
            }
        }

        return res.status(200).json({
            text: cleanText,
            score: score,
            weaknesses: weaknesses,
            improvements: improvements,
            fullResponse: aiText,
            scenario: scenario
        });

    } catch (error) {
        console.error('Function Error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
};

