// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;

// On Toggle Click
themeToggle.addEventListener('click', () => {
    if (htmlTag.getAttribute('data-theme') === 'dark') {
        htmlTag.setAttribute('data-theme', 'light');
        localStorage.setItem('epicScholarTheme', 'light');
    } else {
        htmlTag.setAttribute('data-theme', 'dark');
        localStorage.setItem('epicScholarTheme', 'dark');
    }
    // Optional: Add header droplet wave effect on toggle
    document.querySelector('header').classList.add('header-anime');
    setTimeout(() => { document.querySelector('header').classList.remove('header-anime'); }, 950);
});

// Persistent theme storage
window.addEventListener('DOMContentLoaded', () => {
    const storedTheme = localStorage.getItem('epicScholarTheme');
    if (storedTheme) {
        htmlTag.setAttribute('data-theme', storedTheme);
    }
});

// Optional: Animate important header on theme switch
const header = document.querySelector('header');
header.addEventListener('animationend', () => {
    header.classList.remove('header-anime');
});
