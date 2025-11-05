# Minimalist Portfolio

A clean, typography-focused one-page portfolio with dark mode support and smooth animations.

## Features

- ✨ Minimal, centered layout that fits on one screen
- 🎨 Subtle dark mode toggle with localStorage persistence
- 🖍️ Beautiful gradient marker highlight effect (inspired by hand-drawn highlighting)
- 📱 Fully responsive design
- ⚡ Pure HTML/CSS/JavaScript - no frameworks
- 🎯 Easy customization with CSS variables
- ♿ Semantic HTML with proper `<mark>` tags
- ✨ Smooth micro-interactions on hover

## Quick Start

1. Open `index.html` in your browser
2. Customize your content and styling (see below)

## Customization Guide

### Content (index.html)

Update the following sections:
- **Name**: Change "Your Name" in the `<h1>` tag
- **Tagline**: Update the description under your name
- **About**: Modify the about section text
- **Highlights**: Edit `<mark>` tags to emphasize different text
- **Links**: Update href attributes and link text for your socials/blog
- **Footer**: Change the footnote text
- **Favicon**: Add your `favicon.ico` file to the root directory

### Styling (styles.css)

All customization variables are at the top of `styles.css`:

```css
:root {
    /* Colors - Light Mode */
    --bg-color: #ffffff;
    --text-color: #1a1a1a;
    --link-hover: #ff9500;         /* Link hover color */

    /* Highlight Colors - Light Mode */
    --highlight-color-start: rgba(255, 225, 0, 0.1);
    --highlight-color-mid: rgba(255, 225, 0, 0.7);
    --highlight-color-end: rgba(255, 225, 0, 0.3);

    /* Typography */
    --font-main: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;

    /* Spacing */
    --side-padding: 10vw;          /* Side margins */
}
```

#### Quick Customizations

**Change highlight color (use your brand color):**
```css
/* Adjust the RGB values to match your color */
--highlight-color-start: rgba(YOUR_R, YOUR_G, YOUR_B, 0.1);
--highlight-color-mid: rgba(YOUR_R, YOUR_G, YOUR_B, 0.7);
--highlight-color-end: rgba(YOUR_R, YOUR_G, YOUR_B, 0.3);
```

**Change link accent color:**
```css
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
--highlight-animation-duration: 1.5s;  /* Slower highlight reveal */
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

- **Page load**: Smooth fade-in with upward motion
- **Highlights**: Drawing reveal animation with gradient marker effect
- **Links**: Animated underline on hover with slide transition
- **Link list**: Staggered fade-in
- **Hover effects**: Smooth color transitions and micro-movements

## Highlight Effect Attribution

The gradient marker highlight effect is inspired by [this Stack Overflow answer](https://stackoverflow.com/questions/33451683/pen-highlighter-effect-in-css) by Max Hoffmann (CC BY-SA 4.0), adapted with custom animation and theming.

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

## License

Free to use and modify for personal projects.
