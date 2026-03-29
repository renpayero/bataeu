# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run db:push      # Push schema changes to DB (no migration history)
npm run db:migrate   # Create and apply a named migration
npm run db:studio    # Open Prisma Studio GUI
```

Requires `DATABASE_URL` env var (PostgreSQL). See `.env.example`. The app is configured for `output: 'standalone'` (Docker-friendly).

**Docker:** `docker compose up` starts PostgreSQL 15 (port 5433→5432) + the app (port 3000). The Dockerfile runs `prisma migrate deploy` on startup.

## Architecture

**Next.js 14 App Router** with three pages: `/` (Nosotros — relationship counter + timeline), `/ciclo` (calendar + cycle info), and `/antojos` (food cravings list). Page transitions use `app/template.tsx` (Framer Motion fade+slide wrapper).

**Navigation:** `components/ClientShell.tsx` wraps all pages (via `app/layout.tsx`) with `components/NavBar.tsx` — bottom tab bar on mobile, top header nav on desktop. Active tab indicator animates with Framer Motion `layoutId`.

**Data flow:**
- `app/page.tsx` — "Nosotros" landing; relationship counter (`RelationshipCounter`) + milestone timeline (`MilestoneTimeline`); fetches special dates via `/api/dates`
- `app/ciclo/page.tsx` — Client component (`'use client'`); fetches latest cycle via `/api/cycle` on mount, passes data to child components
- `app/api/cycle/route.ts` — GET returns `findFirst` (latest cycle entry); POST creates new entry. Dates saved as noon UTC (`T12:00:00.000Z`) to avoid timezone shifting.
- `app/api/antojos/route.ts` — Lazy deletes expired entries (>24h) on every GET/POST; max 4 antojos enforced server-side (429 when full)
- `app/api/antojos/[id]/route.ts` — PUT updates and DELETE removes individual antojos by ID
- `app/api/dates/route.ts` — GET lists all special dates (ordered by date asc); POST creates a new one (validates title+date, noon UTC normalization)
- `app/api/dates/[id]/route.ts` — PUT updates and DELETE removes individual special dates by ID
- `app/api/tips/route.ts` — Picks a random tip from `lib/tips.ts` filtered by phase + optional `day` + `excludeId`

**Cycle logic (`lib/cycleLogic.ts`):**
- Phase 1 (Menstruación): days 1–`periodLength`
- Phase 2 (Folicular): days `periodLength+1` to `ovulationDay-1`
- Phase 3 (Ovulación): day `ovulationDay` (= `cycleLength - 14`)
- Phase 4 (Lútea): remaining days
- Luteal phase is always ~14 days; ovulation adjusts for non-28-day cycles.

**Tips (`lib/tips.ts`):**
- 125 tips across 4 phases. Some have `minDay`/`maxDay` constraints to avoid contextually wrong tips (e.g., "day 1 surprise" tip has `minDay:1, maxDay:2`).
- `getRandomTip()` filters by day constraints; falls back to unconstrained pool if the filtered pool is empty.

**UI patterns:**
- Glassmorphism: `backdrop-filter: blur`, use `.glass` / `.glass-strong` CSS classes from `globals.css`
- Animations: Framer Motion throughout — `AnimatePresence` for exit animations, `whileTap`/`whileHover` on all interactive elements
- Phase colors defined as CSS custom properties (`--phase-N-primary`, `--phase-N-bg`, etc.) in `globals.css`; their Tailwind equivalents are in `lib/phases.ts`
- `lib/phases.ts` also exports `phaseMessages` (mascot dialogue), `boyfriendTips` (navbar tips), `phaseInfo` (icons, names, colors), and `phaseDayColors` (calendar day backgrounds)
- Fonts: `font-nunito` (body default), `font-playfair` (display headings)

**`components/Mascot.tsx`:** Animated SVG character. Accepts `phase` (1–4), `variant` (`default` | `hungry`), and `containerClassName` to control outer dimensions. Always pass `containerClassName` to prevent the default large size from overflowing its container.

**`components/AntojoForm.tsx`:** Used for both create (POST) and edit (PUT via `antojoId` prop). `onSuccess` receives the full `AntojoData` object (with real DB `id`) — critical for optimistic updates to work correctly.

**`components/SpecialDateForm.tsx`:** Same pattern as AntojoForm — create (POST) and edit (PUT via `dateId` prop). `onSuccess` receives full `SpecialDateData`.

**Couple config (`lib/coupleConfig.ts`):** Hardcoded `COUPLE_START_DATE` and `COUPLE_NAMES`. Used by `RelationshipCounter` and `MilestoneTimeline`.

**Milestones (`lib/milestones.ts`):** `generateMilestones(startDate)` returns auto milestones (100d, 6mo, 1yr, etc.). `getNextMilestone(startDate)` returns the next upcoming one.

**Prisma schema:** Three models — `CycleEntry` (startDate, cycleLength, periodLength), `Antojo` (content, emoji, createdAt), and `SpecialDate` (title, date, emoji, createdAt). Only one `CycleEntry` is used at a time (latest wins).
