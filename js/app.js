import { showView } from './ui/navigation.js?v=10';
import { initBangleForm } from './ui/bangleForm.js?v=10';
import { initRingForm } from './ui/ringForm.js?v=10';
import { initBraceletForm } from './ui/braceletForm.js?v=10';
import { initResultView } from './ui/resultView.js?v=10';

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        }
    });

    // Initialize component logic
    initBangleForm();
    initRingForm();
    initBraceletForm();
    initResultView();

    // Bind Home screen cards
    const bangleCard = document.getElementById('card-bangle');
    if (bangleCard) {
        bangleCard.addEventListener('click', () => {
            showView('view-bangle');
        });
    }

    const ringCard = document.getElementById('card-ring');
    if (ringCard) {
        ringCard.addEventListener('click', () => {
            showView('view-ring');
        });
    }

    const braceletCard = document.getElementById('card-bracelet');
    if (braceletCard) {
        braceletCard.addEventListener('click', () => {
            showView('view-bracelet');
        });
    }

    const comingSoonCards = ['card-earring'];
    comingSoonCards.forEach(id => {
        const card = document.getElementById(id);
        if (card) {
            card.addEventListener('click', () => {
                showView('view-coming-soon');
            });
        }
    });

    // Bind Back buttons
    document.getElementById('btn-bangle-back').addEventListener('click', () => {
        showView('view-home');
    });

    const btnRingBack = document.getElementById('btn-ring-back');
    if (btnRingBack) {
        btnRingBack.addEventListener('click', () => {
            showView('view-home');
        });
    }

    const btnBraceletBack = document.getElementById('btn-bracelet-back');
    if (btnBraceletBack) {
        btnBraceletBack.addEventListener('click', () => {
            showView('view-home');
        });
    }

    document.getElementById('btn-soon-back').addEventListener('click', () => {
        showView('view-home');
    });

    // Show initial view
    showView('view-home');
});
