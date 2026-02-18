// Groq API Integration for Ripost
// Vercel Serverless Function

const fetch = require('node-fetch');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPTS = {
    raise: `Jesteś wymagającym szefem w trakcie rozmowy o podwyżkę. Twoja rola:
- Zadawaj trudne pytania o konkretne osiągnięcia i liczby
- Kwestionuj ogólne stwierdzenia typu "ciężko pracuję"
- Wymagaj konkretów: projekty, metryki, wymierne rezultaty
- Bądź sceptyczny, ale fair - jeśli argument jest dobry, to przyznaj
- Po 2-3 wymianach daj szczegółową ocenę 1-10

Gdy dajesz ocenę, użyj formatu:
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
- Po 2-3 wymianach daj szczegółową ocenę 1-10

Gdy dajesz ocenę, użyj formatu:
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
- Zadawaj trudne pytania behawioralne (STAR method)
- Testuj wiedzę techniczną i soft skills
- Pytaj o słabe strony i porażki
- Sprawdzaj kulturę pracy i dopasowanie do firmy
- Po 2-3 wymianach daj szczegółową ocenę 1-10

Gdy dajesz ocenę, użyj formatu:
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

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, conversationHistory, scenario, messageCount } = req.body;

        if (!message || !scenario) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!GROQ_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Build messages for Groq
        const messages = [
            {
                role: 'system',
                content: SYSTEM_PROMPTS[scenario]
            }
        ];

        // Add conversation history
        if (conversationHistory && conversationHistory.length > 0) {
            conversationHistory.forEach(msg => {
                messages.push({
                    role: msg.role,
                    content: msg.content
                });
            });
        }

        // Determine if we should give evaluation (after 2-3 exchanges)
        const shouldEvaluate = messageCount >= 2;

        if (shouldEvaluate) {
            messages.push({
                role: 'system',
                content: 'To już 2-3 wymiana. Teraz daj szczegółową ocenę używając dokładnie formatu z [OCENA: X/10], SŁABE PUNKTY, JAK POPRAWIĆ i PODSUMOWANIE.'
            });
        }

        // Call Groq API
        const groqResponse = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 0.9
            })
        });

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            console.error('Groq API Error:', errorText);
            return res.status(500).json({ 
                error: 'Groq API error',
                details: errorText
            });
        }

        const groqData = await groqResponse.json();
        const aiText = groqData.choices[0].message.content;

        // Parse evaluation if present
        let score = null;
        let weaknesses = [];
        let improvements = [];
        let cleanText = aiText;

        if (aiText.includes('[OCENA:') || aiText.includes('OCENA:')) {
            // Extract score
            const scoreMatch = aiText.match(/\[?OCENA:\s*(\d+)\/10\]?/i);
            if (scoreMatch) {
                score = parseInt(scoreMatch[1]);
            }

            // Extract weaknesses
            const weaknessSection = aiText.match(/SŁABE PUNKTY:\s*((?:\d+\..*?(?=\n\d+\.|JAK POPRAWIĆ:|PODSUMOWANIE:|$))+)/s);
            if (weaknessSection) {
                weaknesses = weaknessSection[1]
                    .split(/\n/)
                    .filter(line => /^\d+\./.test(line.trim()))
                    .map(line => line.replace(/^\d+\.\s*/, '').trim())
                    .filter(Boolean)
                    .slice(0, 3);
            }

            // Extract improvements
            const improvementSection = aiText.match(/JAK POPRAWIĆ:\s*((?:\d+\..*?(?=\n\d+\.|PODSUMOWANIE:|$))+)/s);
            if (improvementSection) {
                improvements = improvementSection[1]
                    .split(/\n/)
                    .filter(line => /^\d+\./.test(line.trim()))
                    .map(line => line.replace(/^\d+\.\s*/, '').trim())
                    .filter(Boolean)
                    .slice(0, 3);
            }

            // Extract summary
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
