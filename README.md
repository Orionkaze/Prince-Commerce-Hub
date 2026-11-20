# Jave English — Official Website

A production-grade, responsive single-page website for **"Jave English"** (an online English coaching platform by CELTA-certified Irish teacher Jave Carter) built with **Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Embla Carousel, and Lucide Icons**.

Replicating the exact editorial Framer aesthetic, color system, Plus Jakarta Sans typography, custom hand-drawn SVG doodles, smooth momentum carousels, and sticky stacking cards.

---

## 🎨 Design System & Tokens

- **Font Family:** `Plus Jakarta Sans` (weights 400, 500, 600, 700, 800)
- **Type Scale:**
  - Hero H1: `text-[44px] sm:text-[60px] lg:text-[74px] font-extrabold tracking-[-0.035em] leading-[1.03]`
  - Section H2: `text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08]`
  - Card/Step H3: `text-[20px] lg:text-[24px] font-bold tracking-[-0.02em] leading-[1.25]`
  - Eyebrow Tag: `inline-block bg-[#FDE047] text-[#16141B] text-[11px] font-extrabold uppercase tracking-[0.08em] px-2.5 py-1 rounded-[4px]`
- **Color Palette:**
  - Primary Canvas: `#FFFFFF`
  - Soft Neutral Surface: `#F7F7F9`
  - Soft Lavender Accent Card: `#ECE8FA`
  - Brand Royal Purple: `#5B32D6` (hover `#4A23C2`)
  - Hero Gradient: `linear-gradient(135deg, #4E2EC2 0%, #371B94 55%, #241068 100%)`
  - Deep Night Indigo: `#1D1136`
  - Obsidian Charcoal: `#16141B`
  - Highlighter Yellow: `#FDE047` / `#FACC15`

---

## 🚀 Getting Started

To run the development server:

```bash
# From workspace root
npm run dev

# Or from the jave-english directory
cd jave-english
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To build for production:

```bash
npm run build
npm run start
```

---

## 🧩 Section Architecture

1. **Sticky Navigation Bar (`h-20`)**:
   - `jave english` wordmark
   - Nav anchors with smooth scroll
   - Live Dublin/Irish time widget (`GMT+1`) updating in real-time
   - Signature pill button with rotating `ArrowUpRight` icon

2. **Hero Section**:
   - Royal Purple gradient canvas
   - "YOUR ENGLISH, YOUR EVERYDAY LIFE." tag
   - H1 with brush-stroke highlight backdrop on "real life."
   - Hand-drawn white star sparkle & curly arrow doodles
   - Scrapbook polaroid photo stack with double offset yellow backing layers, Dublin harbor card peek, verified CELTA badge, and `100% online` floating pill

3. **Common Challenges (3x3 Bento Grid)**:
   - Hesitant speaker photo card with `I... um...` pill
   - 7 line-art doodle cards (`Starting from zero`, `You understand but can't speak`, `Afraid of making mistakes`, `Score stays the same`, `Travel or move abroad`, `Too old to start`, `Struggle with colleagues`)
   - Lavender reassurance card with purple quotes `“`, hand-drawn curved arrow, and bold statement

4. **"What You'll Improve" Smooth Embla Carousel**:
   - `dragFree: true` momentum carousel
   - Alternating full-bleed gradient cards & split white cards with 8-point asterisk doodle
   - Navigation controls (`<` and `>`)

5. **Instructor Intro & Video Showcase**:
   - Section introduction by Jave Carter
   - Video container with yellow 5-line sunburst doodle
   - Centered play button triggering interactive video preview modal

6. **Sticky Stacking Course Cards**:
   - Built using Framer Motion `useScroll` + `useTransform` and CSS `sticky`
   - Smooth scale down (`1 -> 0.97`) as next card slides over
   - English for Work, English for Kids, IELTS Preparation

7. **Online Lesson 6-Step Staggered Walkthrough**:
   - Diagonal stepped 2-row layout with muted lavender numbers (`01`–`06`)
   - Yellow highlighter tape bars and purple curly-loop doodles on photo frames

8. **"Learning Path" 5-Tier Ascending Staircase**:
   - Deep Night Indigo (`#1D1136`) background
   - Polygon clip-path angled columns with progressive heights and purple shades
   - Yellow curved arrow SVG doodle pointing up-right above step 03

9. **"Class Schedule" Dark Section**:
   - Grouped schedule cards for Everyday Conversation, Travel, and Kids English
   - Interactive `Open` and `2 Slots Left` badges triggering reservation modal with confetti celebration

10. **"Starting is simple." 4-Step Onboarding**:
    - 4-column step grid with line-art doodles
    - Interactive 3-question diagnostic **Level Test Modal** with instant recommendation

11. **Reviews & Student Feedback Carousels**:
    - Public reviews carousel with 5-star crown doodle
    - Student feedback split cards carousel with heart doodle and synced bottom pill progress bar

12. **Final CTA Banner & Dark Footer**:
    - Obsidian Charcoal (`#16141B`)
    - Split CTA with Jave photo
    - Newsletter subscription box with live validation
    - Prominent contact links and copyright bar
