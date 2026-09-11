# Sportmerch — Design System

> **Support, so wie du ihn verdienst.**
> Made for Local Heroes — You play the game, we run your shop.

Sportmerch is an Austrian (sportmerch.at) merchandising platform for **amateur and youth sports clubs**. They give every club — and every player on every team — a free shop page where fans, families and friends can buy high-quality, personalised merch (player name + number, just like the pros). Every purchase pours money straight back into the club. No risk, no setup cost, no bureaucracy.

**The brand voice is German.** It is direct, warm, anti-corporate, and physical. Sportmerch is the **Enabler** for community sport — never the "partner", never the "platform". It is on the side of the volunteer trainer, the parent in the stands, the kid getting their first jersey.

---

## Sources

This system was built from the assets the team supplied:

- `uploads/Sportmerch CI.pdf` — 1-page Corporate Identity sheet (logo lockups, primary palette, type)
- `uploads/Sportmerch-Wickelfaltz.pdf` — 2-page acquisition flyer (Wickelfalz) → promise pillars (0 € / 0 / 7 €), 3-step process, quality manifesto, "Stage Is Yours" copy
- 8 logo PNG files (color / black / white × brandmark / long lockup / 1:1 mark)
- Fair Wear · GOTS · OEKO-TEX 100 certification marks (sustainability stack)
- "Musterverein" example club crest (eagle / rope stamp) + alt brandmark — used as the canonical club-crest placeholder across the system
- A full product + lifestyle photoshoot (track athlete in maroon hoodie, studio crewnecks + tees front/back, blank Stanley/Stella samples, "GET SPORTMERCH" QR backprint mockup)
- A written manifesto + mission/vision/values/audience brief (in conversation)

There is **no codebase, Figma, or production website** in this project yet. The UI Kit in `ui_kits/website/` is built **forward** from the brand fundamentals — it's a high-fidelity proposal for what sportmerch.at and a club shop could look like, faithful to the CI but not a recreation of an existing build.

---

## CONTENT FUNDAMENTALS

### Language & person
- **German first.** Every customer-facing line of copy is in German. English is acceptable for a tagline ("Made for Local Heroes") because it lands as sport-culture vernacular, but never as the default.
- **Du, never Sie.** Sportmerch speaks to teammates, not customers. "Du spielst das Spiel, wir kümmern uns um deinen Shop."
- **Wir + ihr.** First-person plural is the brand's lens ("Wir glauben…", "Wir kämpfen gegen…"). The reader is "ihr / euer Verein / eure Community".

### Tone
- **Manifesto-energy, not marketing copy.** Short declarative sentences. Periods, not exclamation points. Confidence comes from the verb, not the punctuation.
- **Anti-corporate, pro-community.** The villain in the brand story is *complication, cost, and the gulf between pro circus and base work* — not a competitor. Words like *Bürokratie*, *Aufwand*, *Risiko* are named so they can be denied.
- **Heroic, but grounded.** "Local Heroes", "Helden von nebenan", "wahre Passion". The hero is always the volunteer or the youth player — never Sportmerch itself.

### Casing
- **Display = ITALIC UPPERCASE.** The wordmark sets the rule. Display headlines and section heads are extra-bold italic ALL CAPS, optical-sized so they read like a jersey number, not a shouty banner.
- **Body = sentence case**, German rules (capitalised nouns).
- **CTAs = ALL CAPS, short.** "JETZT SHOP STARTEN", "MITGLIED WERDEN", "ZU DEINEM TEAM".

### Specific signature lines
| Line | Where it lives |
|---|---|
| *Support, so wie du ihn verdienst.* | Tagline under the logo |
| *Made for Local Heroes.* | Hero / merch labels |
| *You play the game, we run your shop.* | Pitch / about |
| *Lieblingsteile statt nur Merch.* | Product / quality story |
| *Schluss mit Kompliziert. Schluss mit Teuer.* | Manifesto break |
| *Für die Liebe zum Spiel. Für euren Verein.* | Closer / footer |

### Don'ts
- No emoji in product copy. (One ⚽ in social, *maybe*. The brand is not an emoji brand.)
- No "Hey there!" / "Awesome!" / startup-cheery language.
- No buzzwords: *seamless, leverage, ecosystem, solution, partner.* Sportmerch is the **Enabler**.
- No fake urgency ("Nur noch heute!"). Trust is the currency.

---

## VISUAL FOUNDATIONS

### Colors
The CI specifies a tight five-token primary palette. Treat it as the fixed gravity of every layout:

| Token | Hex | Role |
|---|---|---|
| `--sm-navy` | `#1e3a5f` | Primary deep navy. Wordmark, dominant inverse surfaces, footer, headers, jersey lockups. |
| `--sm-red` | `#d72638` | Energy red. Primary CTA, the "S" in the logo, the speed-trail, hover states on links. |
| `--sm-yellow` | `#f4a900` | Award / signal yellow. Used as a **signal background** for headers, footers, ribbons, podium moments, "Local Hero" badges, and financial-impact callouts. The boldest of the three brand colours — deploy when a section needs to stop the eye. |
| `--sm-grey` | `#d1d5db` | Neutral. Dividers, disabled states, subtle backgrounds. Soft, never grungy. |
| `--sm-white` | `#ffffff` | Default canvas. |

I derived 100→900 ramps for navy, red, yellow, and grey in `colors_and_type.css` so that real-world UI (hover states, borders, banded sections) has somewhere to live. The two true "brand" colors are navy and red — yellow is the spice.

### Color vibe of imagery
Photography should feel like **Saturday-afternoon stand-side**: bright daylight or floodlight, warm skin tones, slightly contrasty, never overly graded. Picture an amateur match — grass, breath, jerseys, a parent on the touchline. Avoid stock-photo blue-orange teal grading. Black-and-white is acceptable for archive-feel features (history of a club).

### Typography
- **Display: Futura PT Extra Bold, italic, uppercase.** This is the wordmark logic extended into headlines. Forward-slanted because the brand is in motion.
- **Body: Futura PT Book, roman, sentence case.** Clean, geometric, neutral.
- **Brand fonts now live in `fonts/`** as Futura Cyrillic (Light, Book, Medium, Demi, Bold, ExtraBold, Heavy). These are wired up via `@font-face` in `colors_and_type.css` and replace the earlier Jost substitution. The TTFs contain no true italic, so italic display heads use synthesized obliques — close, but if a designed italic exists, please supply it.

### Backgrounds
- **Mostly white** with bands of **navy** for inverse sections (footer, hero of certain pages, "About us" splash).
- **Full-bleed photography** on club / player hero shots — always with a navy or red-overlay protection gradient (`linear-gradient(180deg, transparent, rgba(30,58,95,.85))`) so the wordmark and CTAs stay legible.
- **No gradients as decoration.** The only gradient on the site is the speed-trail of the brandmark itself, and protection gradients on photos.
- **No textures, no noise, no patterns.** The brand is a clean, structured sportswear catalogue voice — not a festival flyer.

### The "Speed Trail"
The logo's defining motif: the red "S" leaves a trail of three or four progressively-faded ghost copies behind it (mostly horizontal). **This is the one motion-as-graphic-device the brand owns.** Use it sparingly:
- Behind hero numbers (a "7" with a fading echo)
- Under section headers as a graphic underline
- On hover for primary navigation
Never on body text. Never more than once per screen.

### Borders
- 1px hairlines in `--border` (light grey) for cards, fields, table rows.
- 2px in `--sm-ink` for emphasis cards (a featured player, a "this is where the money goes" callout).
- No dashed borders. No double borders.

### Corner radii
Restrained, not pillowy:
- `4px` form fields, badges
- `8px` cards, buttons (default)
- `12px–16px` hero / feature cards
- `999px` chips, avatars, the occasional pill CTA

### Shadows & elevation
Soft, low-y, never coloured by default. Three steps (`--shadow-1/2/3`). Two **brand** shadows (`--shadow-red`, `--shadow-navy`) exist for CTAs that need to lift off a busy product photo.

### Cards
- White background, 1px `--border` hairline, `--shadow-1` rest, `--shadow-2` on hover, 8–12px radius.
- No left-border-color accent stripe (visual cliché — banned).
- Featured / promoted cards swap the hairline for a 2px ink border *or* a navy fill with white type.

### Buttons
Three primary types:
1. **Primary (red):** filled `--sm-red`, white text, italic-uppercase label, 8px radius, `--shadow-red` on hover, scale 0.98 on press.
2. **Secondary (navy outline):** transparent, 1.5px navy border, navy italic label.
3. **Ghost / link:** text-only, red label, animated underline on hover.
A **Local Hero** variant exists — yellow background, navy text — for one-off podium CTAs only.

### Form fields
- 44px minimum height (touch target).
- 1px `--border` rest, 1.5px `--sm-navy` focus, 1.5px `--sm-red` error.
- Label sits above, body weight, sm-fs.
- Helper text 12px in `--fg-3`.

### Hover & press states
- **Hover (button):** raise via shadow swap, color darkens by ~6% (`-red-600` from `-red-500`), 120ms ease-out.
- **Hover (card):** translateY(-2px) + shadow-2.
- **Hover (link):** underline appears with 3px offset, color stays.
- **Press:** transform: scale(0.98), 80ms.
- **Focus-visible:** 2px navy outline with 2px white offset (so it works on photos).

### Animation
- **Default duration 200ms, easing `cubic-bezier(.2,.8,.2,1)`** (soft out).
- **Snap easing** for award moments (`cubic-bezier(.18,.89,.32,1.28)`).
- No bounces on UI. No fade-ins on page load except a subtle 240ms fade for hero photo.
- The speed-trail is the only "showy" animation — used on hover of headline numbers (e.g. a player's jersey number).

### Layout rules
- 12-column grid, 80px outer gutter desktop, 16px mobile.
- Max content width `1200px`. Hero sections may go full-bleed.
- Section vertical rhythm: 96px between major sections desktop / 64px mobile.
- Sticky header is `--sm-navy` with white wordmark, 64px tall, 1px bottom hairline.

### Use of transparency / blur
- Sticky header gets `backdrop-filter: blur(8px)` and 92% navy when scrolled.
- Photo overlays use solid navy at 70–85% — not blurred.
- Modals: 60% navy scrim, no blur (keeps the page legible behind for context).

### Fixed elements
- Top nav (sticky, 64px).
- "Mein Verein" basket pill (bottom-right on mobile, in the nav on desktop) — red.
- That's it. No chat bubbles, no cookie banners floating, no popovers nagging.

---

## ICONOGRAPHY

The CI did **not** specify an icon system. To stay consistent with the geometric, italic-bold, sportswear feel of the wordmark, this design system uses **Lucide** icons (CDN) with `stroke-width: 2` and stroke colour matched to current text colour. Lucide is open-source, geometric, and balances well next to Futura PT.

- **Primary icon font/library:** [Lucide](https://lucide.dev) via `unpkg`.
- **No emoji** in product UI. Brand voice is direct, not chatty.
- **No unicode dingbats** (✓ ★ ➜) outside marketing copy.
- **Logo / brandmark PNGs** (in `assets/`) are the *only* raster icons that ship with this system. Use the SVG-able logos as scalable lockups, never composed inline.
- **Crests / club logos** are user-uploaded by clubs themselves — design system reserves a circular 64×64 / 96×96 "crest slot" with a 1px hairline ring.

If a designer needs an icon Lucide doesn't have, draw it at 24×24 with 2px strokes, rounded ends, no fills (matches Lucide). Flag any addition in the kit.

> **Substitution flag:** if Sportmerch later commissions or licenses a custom icon set, swap Lucide out at the CDN line in `ui_kits/website/index.html`.

---

## INDEX

```
sportmerch-design-system/
├── README.md                  ← you are here
├── SKILL.md                   ← agent skill manifest
├── colors_and_type.css        ← all CSS vars + element styles
├── assets/                    ← logos, brandmarks
│   ├── logo-mark-color.png
│   ├── logo-mark-black.png
│   ├── logo-mark-white.png
│   ├── logo-long-color.png
│   ├── logo-long-black.png
│   ├── logo-long-white.png
│   ├── logo-brandmark-only.png
│   └── logo.png
├── preview/                   ← Design System tab cards
│   ├── colors-primary.html
│   ├── colors-extended.html
│   ├── colors-semantic.html
│   ├── type-display.html
│   ├── type-scale.html
│   ├── type-eyebrow.html
│   ├── spacing.html
│   ├── radii.html
│   ├── shadows.html
│   ├── buttons.html
│   ├── form-fields.html
│   ├── cards.html
│   ├── badges.html
│   ├── logo-lockups.html
│   ├── brand-motif.html
│   └── ...
└── ui_kits/
    └── website/
        ├── README.md
        ├── index.html         ← interactive marketing site + club shop click-thru
        ├── Header.jsx
        ├── Hero.jsx
        ├── Buttons.jsx
        ├── Cards.jsx
        ├── PlayerGrid.jsx
        ├── ProductCard.jsx
        ├── Footer.jsx
        └── ...
```

---

## UI KITS

- **`ui_kits/website/`** — interactive click-thru prototype of `sportmerch.at`. Home → Club page → Player shop → Product detail → Cart drawer → Success. Open `ui_kits/website/index.html`. Built forward from the CI sheet, not a recreation of an existing build.

## CAVEATS & FLAGS

1. **Brand fonts wired** — Futura PT is now served from Adobe Fonts kit `qso4xte` (`https://use.typekit.net/qso4xte.css`) as the primary display + body face; locally-hosted Futura Cyrillic remains as the offline fallback. Adobe Fonts requires the consuming domain to be added to the kit's allowed-domains list — make sure `sportmerch.at` (and any preview host) is listed there.
2. **No icon system was provided.** I selected **Lucide** for its geometric weight match. If you have a preferred set (or a custom one), please share.
3. **No production code, Figma, or live URL** was provided. The UI Kit is therefore a **proposal**, not a recreation. If you have an existing site, codebase, or Figma file, share it and the kit will be re-aligned to ground truth.
4. **No photography** was provided. Image slots use placeholder colour blocks — supply 4–8 representative match-day photos and the system will pick up.
5. **No icon for "Local Hero" badge / podium graphic** has been designed yet — it's referenced in copy but not visualised. Worth a brand-illustration sprint.

---

## FLYER PATTERNS (Wickelfalz)

The 2-page acquisition flyer codified five reusable patterns that now live as preview cards:

### 1. Promise Pillars — `0 € · 0 · 7 €`
The single most important brand block. Three pills, in fixed order, on **navy / red / yellow** — each owning one of the three brand colors. Label = italic ALL-CAPS. The number is display-scale (italic, -0.04em tracking). Use as hero anchor, footer reassurance, or sales-collateral header. See `preview/promise-pillars.html`.

### 2. Three-Step Process — `Bestellen ab 1 · Kein Lager · Lieferung`
Red arrows, ghost numerals in `grey-100` behind each step, italic-uppercase labels. The print-on-demand story in three beats. See `preview/process-steps.html`.

### 3. Certifications Stack — Fair Wear · GOTS · OEKO-TEX 100
Used wherever we say "Qualität & Fairness", "Lieblingsteile statt Massenware" or talk about Bio-Baumwolle. The order is fixed: **Fair Wear → GOTS → OEKO-TEX**. Available as full tiles (with explanatory caption) or as a 28px inline lockup for footers. See `preview/certifications.html`.

### 4. Club Crest Slot
Every club uploads its own crest. The slot is **always a round, white-backed puck** with a 1px hairline (or 2px ink for emphasis) — never tinted, never on a dark fill directly. The white puck is the contrast lock so a navy-on-yellow or red-on-white crest both read on any surface. Sizes: 32 (avatar) / 48 (header) / 64 (default) / 96 (hero). See `preview/club-crest.html`.

### 5. Local Hero Card
The flyer's `The Stage Is Yours!` block, translated into a player card: full-bleed portrait, navy protection-gradient, crest puck top-left, optional yellow "Local Hero" ribbon top-right, italic display name + Speed-Trail jersey number, red CTA. See `preview/local-hero-card.html`.

### Manifest copy blocks
The four signature lines (`Leidenschaft verdient Sichtbarkeit.`, `The Stage Is Yours!`, `Lieblingsteile statt Massenware.`, `Für die Liebe zum Spiel. Für euren Verein.`) live as the four colour-coded marketing blocks in `preview/marketing-taglines.html`. **Whenever the block colour is navy or red, copy is white. Yellow gets navy text. Cream gets ink.** No exceptions.

### Acquisition / QR
The flyer's CTA — `www.get.sportmerch.at` + QR + `get@sportmerch.at` — lives as a navy panel with a yellow URL accent and a white QR tile. Pair with a backprint-mockup of the same QR on a grey crewneck for trade-show / vereinsmesse collateral. See `preview/qr-acquisition.html`.
