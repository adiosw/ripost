// Netlify Function: chat.js
// Obsługuje rozmowy AI (Groq API)

exports.handler = async function(event, context) {
    // Tylko POST
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'GROQ_API_KEY nie jest ustawiony w Netlify Environment Variables' })
        };
    }

    const SYSTEM_PROMPTS = {
        raise: `Jesteś wymagającym szefem w trakcie rozmowy o podwyżkę. Twoja rola:
- Zadawaj trudne pytania o konkretne osiągnięcia i liczby
- Kwestionuj ogólne stwierdzenia typu "ciężko pracuję"
- Wymagaj konkretów: projekty, metryki, wymierne rezultaty
- Bądź sceptyczny, ale fair - jeśli argument jest dobry, przyznaj to
- Rozmawiaj po polsku
- Po 2-3 wymianach daj szczegółową ocenę w formacie:

[OCENA: X/10]

SŁABE PUNKTY:
1. Pierwszy słaby punkt
2. Drugi słaby punkt
3. Trzeci słaby punkt

JAK POPRAWIĆ:
1. Pierwsza konkretna porada
2. Druga konkretna porada
3. Trzecia konkretna porada

PODSUMOWANIE:
Krótkie 2-3 zdaniowe podsumowanie całej rozmowy.`,

        promotion: `Jesteś wymagającym menedżerem oceniającym kandydata na awans. Twoja rola:
- Sprawdzaj czy kandydat ma umiejętności przywódcze
- Pytaj o konkretne przykłady zarządzania ludźmi/projektami
- Testuj wizję i strategiczne myślenie
- Kwestionuj czy jest gotowy na większą odpowiedzialność
- Rozmawiaj po polsku
- Po 2-3 wymianach daj szczegółową ocenę w formacie:

[OCENA: X/10]

SŁABE PUNKTY:
1. Pierwszy słaby punkt
2. Drugi słaby punkt
3. Trzeci słaby punkt

JAK POPRAWIĆ:
1. Pierwsza konkretna porada
2. Druga konkretna porada
3. Trzecia konkretna porada

PODSUMOWANIE:
Krótkie 2-3 zdaniowe podsumowanie całej rozmowy.`,

        interview: `Jesteś wymagającym rekruterem prowadzącym rozmowę kwalifikacyjną. Twoja rola:
- Zadawaj trudne pytania behawioralne (metoda STAR)
- Testuj wiedzę i soft skills
- Pytaj o słabe strony i porażki
- Sprawdzaj kulturę pracy i dopasowanie do firmy
- Rozmawiaj po polsku
- Po 2-3 wymianach daj szczegółową ocenę w formacie:

[OCENA: X/10]

SŁABE PUNKTY:
1. Pierwszy słaby punkt
2. Drugi słaby punkt
3. Trzeci słaby punkt

JAK POPRAWIĆ:
1. Pierwsza konkretna porada
2. Druga konkretna porada
3. Trzecia konkretna porada

PODSUMOWANIE:
Krótkie 2-3 zdaniowe podsumowanie całej rozmowy.`
    };

    try {
        const { message, conversationHistory, scenario, messageCount } = JSON.parse(event.body);

        if (!message || !scenario) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Brakuje wymaganych pól' })
            };
        }

        const messages = [
            { role: 'system', content: SYSTEM_PROMPTS[scenario] || SYSTEM_PROMPTS.raise }
        ];

        if (conversationHistory && conversationHistory.length > 0) {
            conversationHistory.forEach(msg => {
                messages.push({ role: msg.role, content: msg.content });
            });
        }

        if (messageCount >= 2) {
            messages.push({
                role: 'system',
                content: 'To już 2-3 wymiana. Teraz daj szczegółową ocenę używając formatu [OCENA: X/10], SŁABE PUNKTY, JAK POPRAWIĆ i PODSUMOWANIE.'
            });
        }

        // Wywołanie Groq API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Błąd Groq API', details: errorText })
            };
        }

        const groqData = await groqResponse.json();
        const aiText = groqData.choices[0].message.content;

        // Parsowanie oceny
        let score = null;
        let weaknesses = [];
        let improvements = [];
        let cleanText = aiText;

        if (aiText.includes('[OCENA:') || aiText.includes('OCENA:')) {
            const scoreMatch = aiText.match(/\[?OCENA:\s*(\d+)\/10\]?/i);
            if (scoreMatch) score = parseInt(scoreMatch[1]);

            const weaknessSection = aiText.match(/SŁABE PUNKTY:\s*([\s\S]*?)(?=JAK POPRAWIĆ:|PODSUMOWANIE:|$)/i);
            if (weaknessSection) {
                weaknesses = weaknessSection[1]
                    .split('\n')
                    .filter(l => /^\d+\./.test(l.trim()))
                    .map(l => l.replace(/^\d+\.\s*/, '').trim())
                    .filter(Boolean)
                    .slice(0, 3);
            }

            const improvSection = aiText.match(/JAK POPRAWIĆ:\s*([\s\S]*?)(?=PODSUMOWANIE:|$)/i);
            if (improvSection) {
                improvements = improvSection[1]
                    .split('\n')
                    .filter(l => /^\d+\./.test(l.trim()))
                    .map(l => l.replace(/^\d+\.\s*/, '').trim())
                    .filter(Boolean)
                    .slice(0, 3);
            }

            const summaryMatch = aiText.match(/PODSUMOWANIE:\s*([\s\S]*?)$/i);
            if (summaryMatch) cleanText = summaryMatch[1].trim();
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                text: cleanText,
                score: score,
                weaknesses: weaknesses,
                improvements: improvements
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Błąd serwera', message: error.message })
        };
    }
};
