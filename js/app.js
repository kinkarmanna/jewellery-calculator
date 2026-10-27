import { showView } from './ui/navigation.js?v=32';
import { initBangleForm } from './ui/bangleForm.js?v=32';
import { initRingForm } from './ui/ringForm.js?v=32';
import { initBraceletForm } from './ui/braceletForm.js?v=32';
import { initCustomBangleForm } from './ui/customBangleForm.js?v=32';
import { initResultView } from './ui/resultView.js?v=32';

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
    initCustomBangleForm();
    initResultView();

    // ── Home Screen Cards ──

    // Bangle card on home → Bangle sub-menu
    const bangleMenuCard = document.getElementById('card-bangle-menu');
    if (bangleMenuCard) {
        bangleMenuCard.addEventListener('click', () => {
            showView('view-bangle-menu');
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

    // ── Bangle Sub-Menu Cards ──

    const bangleCard = document.getElementById('card-bangle');
    if (bangleCard) {
        bangleCard.addEventListener('click', () => {
            showView('view-bangle');
        });
    }

    const customBangleCard = document.getElementById('card-custom-bangle');
    if (customBangleCard) {
        customBangleCard.addEventListener('click', () => {
            showView('view-custom-bangle');
        });
    }

    // ── Back Buttons ──

    // Bangle sub-menu → Home
    document.getElementById('btn-bangle-menu-back').addEventListener('click', () => {
        showView('view-home');
    });

    // Bangle calculator → Bangle sub-menu
    document.getElementById('btn-bangle-back').addEventListener('click', () => {
        showView('view-bangle-menu');
    });

    // Custom Bangle calculator → Bangle sub-menu
    const btnCustomBangleBack = document.getElementById('btn-custom-bangle-back');
    if (btnCustomBangleBack) {
        btnCustomBangleBack.addEventListener('click', () => {
            showView('view-bangle-menu');
        });
    }

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
