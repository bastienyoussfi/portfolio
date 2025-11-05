/* ===================================
   DARK MODE TOGGLE
   =================================== */

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

/* ===================================
   OPTIONAL: Add stagger animation to links
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.links li');

    links.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(10px)';

        setTimeout(() => {
            link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 1000 + (index * 100));
    });
});
