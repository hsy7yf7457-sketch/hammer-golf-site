# Hammer Golf — single-page website

A lightweight, dependency-free landing page for the mobile game **Hammer Golf**. Pure HTML, CSS and a tiny bit of vanilla JS — no build step required.

## Run locally

You can just open `index.html` in a browser, but for fonts/images to load reliably (and so the carousel scrolls smoothly), serve the folder over HTTP:

```bash
# Python 3 (built in)
python3 -m http.server 8000

# or, with Node
npx serve .
```

Then visit <http://localhost:8000>.

## File structure

```
.
├── index.html         # Page markup
├── styles.css         # All styles (no framework)
├── script.js          # Mobile nav + courses carousel
├── README.md
└── assets/
    ├── hero.png        # Hero background (HAMMER GOLF scene)
    ├── cta.png         # "Ready to swing?" banner background
    ├── course-1.png    # Full Course island
    ├── course-2.png    # Rookie island
    ├── course-3.png    # Pro island
    ├── icon-no-ads.png # Feature icon
    ├── icon-hammer.png # Feature icon (also used as favicon)
    ├── icon-courses.png# Feature icon
    └── icon-trophy.png # Feature icon
```

## Editing common things

- **Tagline / hero text** — in `index.html`, inside `<section class="hero">`.
- **Feature copy** — in `index.html`, inside `<ul class="feature-grid">`.
- **Courses** — duplicate any `<article class="course-card">` block. Available tag styles: `course-tag--full`, `course-tag--rookie`, `course-tag--pro`.
- **Store links** — update the two `<a class="store-badge">` `href` attributes in the CTA section.
- **Social links** — bottom of `index.html`, inside `<ul class="social">`.
- **Brand colors** — top of `styles.css`, in the `:root` block (`--navy-*`, `--green-*`, `--orange-*`).
- **Fonts** — uses Google Fonts (Inter + Bangers). Swap the `<link>` in `<head>` and the `font-family` declarations to change.

## Accessibility notes

- Skip link, keyboard-focusable carousel dots, `aria-label`s on icon-only buttons.
- Respects `prefers-reduced-motion` (disables scroll smoothing and transitions).
- Mobile menu is keyboard-toggleable and announces its expanded state.

## Replacing the artwork

All images live in `assets/`. Keep filenames the same and they'll drop straight in. Recommended sizes:

| File              | Recommended size      |
| ----------------- | --------------------- |
| `hero.png`        | 2400 × 1400 (16:9‑ish) |
| `cta.png`         | 2400 × 1000 (21:9)    |
| `course-*.png`    | 1200 × 800            |
| `icon-*.png`      | 512 × 512, transparent|

## License

Artwork and copy © Hammer Golf. Code is yours to do whatever with.
