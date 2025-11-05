# Minimalist Portfolio

A clean, typography-focused one-page portfolio with dark mode support and smooth animations.

## Features

- ✨ Minimal, centered layout that fits on one screen
- 🎨 Dark mode toggle with localStorage persistence
- 🖍️ Hand-drawn highlight animation effect
- 📱 Fully responsive
- ⚡ Pure HTML/CSS/JavaScript - no frameworks
- 🎯 Easy customization with CSS variables

## Quick Start

1. Open `index.html` in your browser
2. Customize your content and styling (see below)

## Customization Guide

### Content (index.html)

Update the following sections:
- **Name**: Change "Your Name" in the `<h1>` tag
- **Tagline**: Update the description under your name
- **About**: Modify the about section text
- **Links**: Update href attributes and link text for your socials/blog
- **Footer**: Change the footnote text

### Styling (styles.css)

All customization variables are at the top of `styles.css`:

```css
:root {
    /* Colors - Light Mode */
    --bg-color: #ffffff;
    --text-color: #1a1a1a;
    --emphasis-bg: #fff4e6;        /* Highlight background */
    --emphasis-color: #ff9500;     /* Accent color */
    --link-hover: #ff9500;         /* Link hover color */

    /* Typography */
    --font-main: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;

    /* Spacing */
    --side-padding: 10vw;          /* Side margins */
}
```

#### Quick Customizations

**Change accent color:**
```css
--emphasis-color: #your-color;
--link-hover: #your-color;
```

**Change font:**
```css
--font-main: 'Your Font', sans-serif;
```

**Adjust side spacing:**
```css
--side-padding: 15vw;  /* More space on sides */
```

**Change animation speed:**
```css
--highlight-animation-duration: 1.2s;  /* Slower highlight */
```

### Dark Mode Colors

Customize dark mode colors in the `[data-theme="dark"]` section of `styles.css`.

## Project Structure

```
portfolio/
├── index.html          # Content structure
├── styles.css          # All styling (customize here!)
├── script.js           # Dark mode toggle & animations
└── README.md           # This file
```

## Animations

- **Page load**: Smooth fade-in
- **Highlights**: Hand-drawn marker effect on emphasized text
- **Links**: Animated underline on hover
- **Link list**: Staggered fade-in

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

## License

Free to use and modify for personal projects.
