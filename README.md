# 🌐 Abdikhaliq Hersi — Developer Portfolio

> Personal portfolio website showcasing my projects, skills, and professional experience as a Computer Programming student and IT professional.

🌐 **Live Site:** [abdi54558.github.io](https://abdi54558.github.io)

---

## Overview

A fully custom-built, single-file portfolio website featuring a moving star field, three theme modes, smooth scroll animations, and a responsive layout. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies, no build step required.

---

## Features

- **Animated Star Field** — Canvas-based parallax star animation with three depth layers, twinkle effects, and green/orange color tinting
- **Theme Switcher** — Vertical slider panel with three modes: Dark, Moderate, and Light — preference saved to localStorage
- **Typing Animation** — Hero section cycles through roles using a typewriter effect
- **Scroll Reveal** — IntersectionObserver-based fade-in animations trigger as sections enter the viewport
- **Responsive Layout** — Fully mobile-responsive with hamburger menu for small screens
- **Embedded Profile Photo** — Base64-encoded image, no external hosting required
- **Clickable Contact Cards** — Email, phone, LinkedIn, and GitHub all linked directly
- **Keyboard Shortcut** — Press `T` to cycle through theme modes

---

##  Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure and layout |
| CSS3 | Custom design system, animations, theme variables |
| JavaScript | Canvas rendering, theme switching, typing animation |
| Google Fonts | Space Grotesk, Syne, DM Mono, DM Sans typography |
| Canvas API | Moving star field background |
| IntersectionObserver | Scroll-triggered fade-in animations |
| localStorage | Theme preference persistence |

---

##  Project Structure

```
abdi54558.github.io/
└── index.html      # Complete portfolio — HTML, CSS, and JS in one file
```

The entire portfolio lives in a single self-contained `index.html` file. All styles, scripts, fonts (via Google Fonts CDN), and the profile photo (base64 encoded) are embedded directly — no external dependencies beyond Google Fonts.

---

# Design System

| Token | Dark Mode | Description |
|---|---|---|
| Primary accent | `#00e676` | Bright green — nav, headings, borders |
| Secondary accent | `#ff6d00` | Vivid orange — hover states, logo glow |
| Background | `#000000` | Pure black |
| Surface | `rgba(255,255,255,0.03)` | Card backgrounds |
| Border default | `rgba(255,109,0,0.18)` | Orange card borders |
| Border highlight | `rgba(0,230,118,0.7)` | Green on hover |

---

##  Sections

| Section | Description |
|---|---|
| Hero | Name, typing animation, intro, and CTA buttons |
| About | Personal summary and career stats |
| Skills | 14 technology chips with hover effects |
| Experience | Timeline — CDIC, TekSystems, Algonquin College |
| Projects | ForgeFit project card with live demo link |
| Contact | Info cards for email, phone, LinkedIn, GitHub |

---

## Getting Started

### View it live
```
https://abdi54558.github.io
```

### Run it locally
1. Clone the repository:
```bash
git clone https://github.com/Abdi54558/abdi54558.github.io.git
```
2. Open `index.html` in any browser — no install, no build step, no dependencies

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `T` | Cycle through Dark → Moderate → Light theme |

---

# Future Improvements

- [ ] Rebuild with React and TypeScript using Vite
- [ ] Add more project cards as new projects are completed
- [ ] Add a blog or notes section
- [ ] Add subtle page transition animations
- [ ] Integrate a contact form with email delivery
- [ ] Add resume download button

---

# Contact

**Abdikhaliq Hersi**

- 📧 Email: [ahirsi202@gmail.com](mailto:ahirsi202@gmail.com)
- 📱 Phone: 343-297-3263
- 💼 LinkedIn: [abdikhaliq-hersi](https://linkedin.com/in/abdikhaliq-hersi-a123232b8)
- 🐙 GitHub: [@Abdi54558](https://github.com/Abdi54558)

---

#

This project is open source and available under the [MIT License](LICENSE).
