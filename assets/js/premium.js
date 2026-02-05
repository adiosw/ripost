// Premium animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            t && t.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Nav scroll
    const n = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        n.classList.toggle('scrolled', window.scrollY > 50);
    });

    // FAQ toggle
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            q.parentElement.classList.toggle('active');
        });
    });

    // Animate numbers
    const nums = document.querySelectorAll('[data-count]');
    nums.forEach(n => {
        const t = parseInt(n.dataset.count);
        let c = 0;
        const i = setInterval(() => {
            c += Math.ceil(t / 100);
            if (c >= t) {
                c = t;
                clearInterval(i);
            }
            n.textContent = c;
        }, 20);
    });

    // Play button click
    const play = document.querySelector('.play-button');
    if (play) {
        play.addEventListener('click', () => {
            alert('Demo video - w pełnej wersji tutaj będzie video!');
        });
    }
});
