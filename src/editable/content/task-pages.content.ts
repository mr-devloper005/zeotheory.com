import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Journal desk',
    headline: 'Long-form pieces arranged with a premium editorial cadence.',
    description: 'Article pages should feel spacious, readable, and image-aware instead of collapsing into a generic feed.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Give stories room to breathe, then support them with useful related content and quiet metadata.',
    chips: ['Editorial', 'Reading flow', 'Feature stories'],
  },
  classified: {
    eyebrow: 'Offer index',
    headline: 'Listings and offers with a faster, sharper scan pattern.',
    description: 'Classified pages should stay practical while still carrying the same premium visual language.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Keep urgency visible through price, condition, and action-led cards.',
    chips: ['Offers', 'Quick scan', 'Action first'],
  },
  sbm: {
    eyebrow: 'Saved shelf',
    headline: 'Curated links and resources presented like a modern collection.',
    description: 'Bookmark pages should feel like shelves of useful references with clear titles and calmer metadata.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Resource browsing works best when text remains clean and grouped.',
    chips: ['Collections', 'Reference', 'Useful finds'],
  },
  profile: {
    eyebrow: 'Profile register',
    headline: 'Profiles shaped with identity, imagery, and trust cues first.',
    description: 'Profile pages should highlight the person or brand quickly, then support discovery with imagery and concise context.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Lead with portrait, role, and a confident summary before the longer body copy.',
    chips: ['Identity', 'Profiles', 'Portrait-first'],
  },
  pdf: {
    eyebrow: 'Library archive',
    headline: 'Documents and downloads arranged like a premium resource shelf.',
    description: 'PDF pages should feel like a strong archive, with document cues, cleaner summaries, and clear actions.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Downloads should be discoverable without making the page feel technical.',
    chips: ['Documents', 'Library', 'Archive'],
  },
  listing: {
    eyebrow: 'Directory edition',
    headline: 'Listings built for comparison, location cues, and polished browsing.',
    description: 'Directory pages should feel structured and credible while still matching the site’s elevated visual tone.',
    filterLabel: 'Filter business category',
    secondaryNote: 'Lead with name, location, and direct actions while preserving visual calm.',
    chips: ['Directory', 'Compare', 'Local detail'],
  },
  image: {
    eyebrow: 'Gallery edition',
    headline: 'Image posts led by large visuals and quieter supporting details.',
    description: 'Image pages should behave like a curated gallery with enough variety to keep browsing lively.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let imagery drive the page before text takes over.',
    chips: ['Gallery', 'Image-first', 'Visual discovery'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
