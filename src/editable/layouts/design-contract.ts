import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#eeefe0',
  '--slot4-page-text': '#241314',
  '--slot4-panel-bg': '#f8f8f0',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#6f403e',
  '--slot4-soft-muted-text': '#7b6b66',
  '--slot4-accent': '#819A91',
  '--slot4-accent-fill': '#A7C1A8',
  '--slot4-accent-soft': '#D1D8BE',
  '--slot4-dark-bg': '#140d10',
  '--slot4-dark-text': '#EEEFE0',
  '--slot4-media-bg': '#e5e4da',
  '--slot4-cream': '#f8f8f0',
  '--slot4-warm': '#f2f1e7',
  '--slot4-lavender': '#e8ebdd',
  '--slot4-gray': '#f4f4ec',
  '--slot4-body-gradient': 'linear-gradient(180deg, #140d10 0%, #4b1826 18%, #eeefe0 18.1%, #f8f8f0 62%, #f2f1e7 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[#2a18141a]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_20px_60px_rgba(20,13,16,0.09)]',
  shadowStrong: 'shadow-[0_30px_100px_rgba(20,13,16,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(6,18,25,0.05),rgba(6,18,25,0.78))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[270px] shrink-0 snap-start sm:w-[300px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.32em]',
    heroTitle: 'font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-6xl lg:text-[5rem]',
    sectionTitle: 'font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-full ${editablePalette.accentBg} px-7 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(8,131,149,0.24)]`,
    secondary: `inline-flex items-center justify-center rounded-full border ${editablePalette.darkBorder} bg-white/10 px-7 py-3.5 text-sm font-black text-white transition duration-300 hover:bg-white/16`,
    accent: `inline-flex items-center justify-center rounded-full ${editablePalette.accentBg} px-7 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.4rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_65px_rgba(7,21,29,0.16)]',
    fade: 'transition duration-300 hover:opacity-90',
  },
} as const

export const aiLayoutRules = [
  'Keep the homepage image-led with a cinematic dark hero followed by clean editorial sections.',
  'Preserve dynamic post fetching; never replace fetched posts with mock arrays in editable UI files.',
  'Use multiple card styles across the homepage, archive pages, and related content.',
  'Avoid profile navigation on the homepage.',
  'Keep teal, sea-glass, and pearl tones consistent across buttons, chips, dividers, and surfaces.',
  'Use postHref() or existing buildPostUrl() helpers for post links so routes keep working.',
] as const
