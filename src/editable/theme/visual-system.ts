import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'editorial-paper'
  | 'luxury-atelier'
  | 'brutalist-index'
  | 'organic-journal'
  | 'tech-directory'
  | 'retro-bulletin'
  | 'visual-gallery'

export const visualPresets = {
  'editorial-paper': {
    label: 'Editorial Paper',
    mood: 'quiet, premium, and bright',
    fontDirection: 'serif display with clean sans support',
    colors: {
      background: '#ebf4f6',
      foreground: '#0a2430',
      muted: '#64838b',
      primary: '#07151d',
      accent: '#09637e',
      surface: '#ffffff',
    },
    shape: 'soft premium cards with fine borders',
  },
  'luxury-atelier': {
    label: 'Luxury Atelier',
    mood: 'dark hero, polished editorial layers',
    fontDirection: 'high-contrast serif headlines with compact labels',
    colors: {
      background: '#07151d',
      foreground: '#ebf4f6',
      muted: '#98bcc2',
      primary: '#ebf4f6',
      accent: '#088395',
      surface: '#102632',
    },
    shape: 'glass hero panels with long dark gradients',
  },
  'brutalist-index': {
    label: 'Brutalist Index',
    mood: 'graphic and direct',
    fontDirection: 'big sans headlines with hard labels',
    colors: {
      background: '#eff6f7',
      foreground: '#07151d',
      muted: '#5d7a81',
      primary: '#07151d',
      accent: '#088395',
      surface: '#ffffff',
    },
    shape: 'grid-heavy blocks with stronger dividers',
  },
  'organic-journal': {
    label: 'Organic Journal',
    mood: 'soft and human',
    fontDirection: 'soft serif mixed with airy body text',
    colors: {
      background: '#eef7f8',
      foreground: '#12303a',
      muted: '#68868c',
      primary: '#12303a',
      accent: '#7ab2b2',
      surface: '#ffffff',
    },
    shape: 'gentle cards and layered backgrounds',
  },
  'tech-directory': {
    label: 'Tech Directory',
    mood: 'clean, structured, useful',
    fontDirection: 'sharp sans with compact data styling',
    colors: {
      background: '#f3f8f9',
      foreground: '#08202a',
      muted: '#56747c',
      primary: '#08202a',
      accent: '#09637e',
      surface: '#ffffff',
    },
    shape: 'clear information blocks and pill controls',
  },
  'retro-bulletin': {
    label: 'Retro Bulletin',
    mood: 'playful and printed',
    fontDirection: 'bold display with simple support text',
    colors: {
      background: '#eef6f6',
      foreground: '#0f2731',
      muted: '#607d84',
      primary: '#0f2731',
      accent: '#088395',
      surface: '#ffffff',
    },
    shape: 'framed modules with old-print spacing',
  },
  'visual-gallery': {
    label: 'Visual Gallery',
    mood: 'cinematic, image-led, refined',
    fontDirection: 'editorial serif hero with minimal controls',
    colors: {
      background: '#07151d',
      foreground: '#ebf4f6',
      muted: '#98bcc2',
      primary: '#ebf4f6',
      accent: '#088395',
      surface: '#102632',
    },
    shape: 'immersive media cards with layered overlays',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset:
    slot4BrandConfig.productKind === 'visual'
      ? 'visual-gallery'
      : slot4BrandConfig.productKind === 'editorial'
        ? 'editorial-paper'
        : slot4BrandConfig.productKind === 'directory'
          ? 'tech-directory'
          : 'luxury-atelier',
  radius: {
    sm: '0.75rem',
    md: '1.2rem',
    lg: '2rem',
    xl: '2.8rem',
  },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    cardHover: 'transition duration-300 hover:-translate-y-1 hover:shadow-xl',
    softHover: 'transition duration-300 hover:opacity-90',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.3em]',
    heroTitle: 'font-serif text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl',
    sectionTitle: 'font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl',
    body: 'text-base leading-8',
    caption: 'text-xs font-bold uppercase tracking-[0.2em]',
  },
  surfaces: {
    glass: 'border border-white/12 bg-white/8 backdrop-blur-xl',
    paper: 'border border-black/8 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]',
    quiet: 'border border-black/8 bg-black/[0.03]',
    dark: 'border border-white/10 bg-black/30 shadow-[0_24px_70px_rgba(0,0,0,0.25)]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-18 lg:py-24',
    cardGrid: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name]
}
