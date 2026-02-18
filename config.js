// ⚙️ Ripost Configuration File
// Edit this file to customize your Ripost installation

const CONFIG = {
    // ===== BASIC INFO =====
    app: {
        name: 'Ripost',
        tagline: 'AI Trener Negocjacji',
        domain: 'ripost.vercel.app',
        email: 'kontakt@ripost.pl'
    },

    // ===== PACKAGES =====
    packages: {
        START: {
            name: 'START',
            price: 29,
            currency: 'PLN',
            simulations: 1,
            icon: '🎯',
            features: [
                '1 symulacja z AI',
                'Wszystkie 3 scenariusze',
                'Szczegółowy feedback',
                'Ocena 1-10'
            ],
            naffyUrl: 'https://www.naffy.io/Ripost/ripost-start',
            stripePriceId: 'price_START_ID_HERE'
        },
        PRO: {
            name: 'PRO',
            price: 49,
            currency: 'PLN',
            simulations: 5,
            icon: '⭐',
            badge: 'Najpopularniejszy',
            features: [
                '5 symulacji z AI',
                'Wszystkie 3 scenariusze',
                'Szczegółowy feedback',
                'Ocena 1-10',
                'Historia rozmów'
            ],
            naffyUrl: 'https://www.naffy.io/Ripost/ripost-pro',
            stripePriceId: 'price_PRO_ID_HERE'
        },
        UNLIMITED: {
            name: 'UNLIMITED',
            price: 99,
            oldPrice: 149,
            currency: 'PLN',
            simulations: -1, // -1 = unlimited
            duration: 30, // days
            icon: '🔥',
            badge: 'Cena promocyjna',
            features: [
                'Nielimitowane symulacje',
                'Wszystkie 3 scenariusze',
                'Szczegółowy feedback',
                'Ocena 1-10',
                'Historia rozmów',
                'Dostęp na 30 dni'
            ],
            naffyUrl: 'https://www.naffy.io/Ripost/ripost-unlimited',
            stripePriceId: 'price_UNLIMITED_ID_HERE'
        }
    },

    // ===== SCENARIOS =====
    scenarios: {
        raise: {
            id: 'raise',
            name: 'Podwyżka',
            icon: '💰',
            description: 'Negocjuj wyższą pensję z szefem',
            color: '#10b981'
        },
        promotion: {
            id: 'promotion',
            name: 'Awans',
            icon: '📈',
            description: 'Przekonaj do awansu na wyższe stanowisko',
            color: '#6366f1'
        },
        interview: {
            id: 'interview',
            name: 'Rekrutacja',
            icon: '🎯',
            description: 'Przejdź trudną rozmowę rekrutacyjną',
            color: '#8b5cf6'
        }
    },

    // ===== STATS (for hero section) =====
    stats: {
        users: 500,
        averageRaise: '+25%',
        rating: '4.9',
        showStats: true // Set to false to hide stats section
    },

    // ===== TESTIMONIALS =====
    testimonials: [
        {
            rating: 5,
            text: 'Przećwiczyłem rozmowę o podwyżkę 3 razy z Ripost. Feedback AI pokazał mi, że używam za dużo "może" i "myślę". Po poprawkach dostałem 30% podwyżkę!',
            author: 'Michał K.',
            role: 'Senior Developer',
            avatar: '👨‍💼'
        },
        {
            rating: 5,
            text: 'Jako introwertyku zawsze stresowałam się rozmowami rekrutacyjnymi. Ripost pomógł mi przygotować się na trudne pytania. Dostałam pracę marzeń!',
            author: 'Anna W.',
            role: 'UX Designer',
            avatar: '👩‍💻'
        },
        {
            rating: 5,
            text: 'Trening z AI jest lepszy niż z prawdziwym człowiekiem - nie ocenia, nie krytykuje, tylko daje konkretne wskazówki. Awans w kieszeni!',
            author: 'Piotr S.',
            role: 'Team Leader',
            avatar: '👨‍🔬'
        }
    ],

    // ===== FAQ =====
    faq: [
        {
            question: 'Jak działa kod dostępu?',
            answer: 'Po zakupie pakietu otrzymujesz unikalny kod (np. PRO-49). Wpisujesz go w aplikacji i od razu możesz rozpocząć trening. Kod jest ważny bezterminowo (poza UNLIMITED - 30 dni).'
        },
        {
            question: 'Czy muszę podawać dane osobowe?',
            answer: 'Nie! Nie zbieramy żadnych danych osobowych. Wystarczy kod dostępu - bez rejestracji, bez emaila, bez niczego.'
        },
        {
            question: 'Jak realistyczne są symulacje?',
            answer: 'Używamy Groq AI z modelem Llama 3.1 70B - jednego z najlepszych modeli językowych. AI reaguje jak prawdziwy szef: zadaje trudne pytania, kwestionuje argumenty, wymaga konkretów.'
        },
        {
            question: 'Co jeśli wykorzystam wszystkie symulacje?',
            answer: 'Możesz kupić kolejny pakiet. Kody są niezależne - każdy nowy kod dodaje symulacje do Twojego konta.'
        },
        {
            question: 'Czy mogę użyć tego na telefonie?',
            answer: 'Tak! Ripost to PWA (Progressive Web App). Działa w przeglądarce i możesz dodać do ekranu głównego jak zwykłą aplikację. Kompatybilne z iOS i Android.'
        },
        {
            question: 'Czy mogę zwrócić pakiet?',
            answer: 'Jeśli nie aktywowałeś jeszcze kodu, możesz zwrócić pakiet w ciągu 14 dni. Po aktywacji zwrot nie jest możliwy (zgodnie z prawem o treściach cyfrowych).'
        }
    ],

    // ===== FEATURES =====
    features: [
        {
            icon: '💰',
            title: '3 Scenariusze',
            description: 'Podwyżka, awans, rekrutacja - wszystkie najważniejsze rozmowy zawodowe w jednym miejscu'
        },
        {
            icon: '🧠',
            title: 'Zaawansowane AI',
            description: 'Groq AI z modelem Llama 3.1 70B - najbardziej realistyczne symulacje na rynku'
        },
        {
            icon: '📊',
            title: 'Ocena 1-10',
            description: 'Otrzymujesz szczegółową ocenę swojej argumentacji z podziałem na poszczególne obszary'
        },
        {
            icon: '💡',
            title: 'Konkretne porady',
            description: 'Nie tylko krytyka - dostaniesz dokładne instrukcje jak poprawić swoją rozmowę'
        },
        {
            icon: '📱',
            title: 'Działa wszędzie',
            description: 'PWA - dodaj do ekranu głównego i trenuj z telefonu, tabletu lub komputera'
        },
        {
            icon: '⚡',
            title: 'Natychmiastowy start',
            description: 'Bez rejestracji, bez subskrypcji - kupujesz kod i od razu zaczynasz trening'
        }
    ],

    // ===== SOCIAL LINKS =====
    social: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
    },

    // ===== ANALYTICS =====
    analytics: {
        googleAnalyticsId: '', // G-XXXXXXXXXX
        plausibleDomain: '',
        facebookPixelId: ''
    },

    // ===== API =====
    api: {
        groqModel: 'llama-3.1-70b-versatile',
        maxTokens: 1000,
        temperature: 0.7,
        evaluationThreshold: 2 // After how many exchanges to give evaluation
    },

    // ===== PAYMENT METHOD =====
    payment: {
        method: 'naffy', // 'naffy' or 'stripe'
        stripeLive: false // Set to true for production
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
