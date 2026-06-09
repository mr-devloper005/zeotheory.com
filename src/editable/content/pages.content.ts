import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Luxury visual stories and profile discovery',
      description: 'Explore refined image-led features, profiles, and editorial selections through a premium discovery experience.',
      openGraphTitle: 'Luxury visual stories and profile discovery',
      openGraphDescription: 'Image-first browsing, standout profiles, and elegant editorial sections in one polished experience.',
      keywords: ['image gallery', 'visual discovery', 'profiles', 'editorial stories'],
    },
    hero: {
      badge: 'Premium edition',
      title: ['Designed for visual collections.', 'Built to keep discovery elegant.'],
      description: 'A cinematic front page for images, profiles, and standout reads, shaped with editorial spacing, calm hierarchy, and gallery-first momentum.',
      primaryCta: { label: 'Browse gallery', href: '/image' },
      secondaryCta: { label: 'Explore profiles', href: '/profile' },
      searchPlaceholder: 'Search images, profiles, articles, and collections',
      focusLabel: 'Focus',
      featureCardBadge: 'featured edition',
      featureCardTitle: 'Image-led stories, refined cards, and quieter details.',
      featureCardDescription: 'The homepage stays rooted in live content while feeling closer to a premium gallery platform than a generic feed.',
    },
    intro: {
      badge: 'Editorial system',
      title: 'An image-led experience with space for profiles, reading, and discovery.',
      paragraphs: [
        'The site blends gallery-first browsing with carefully structured content blocks so every section feels intentional instead of crowded.',
        'Visitors can move from visual features to profiles, articles, resource posts, and supporting pages without losing the premium rhythm of the experience.',
        'Every surface is built to stay useful even when individual posts are missing images, categories, or short descriptions.',
      ],
      sideBadge: 'Highlights',
      sidePoints: [
        'Large cinematic hero with editorial callouts.',
        'Multiple card styles for featured, compact, horizontal, list, and image-first moments.',
        'Refined task pages that keep search, pagination, and filters easy to use.',
        'Luxury teal palette with bright reading surfaces and dark hero sections.',
      ],
      primaryLink: { label: 'Browse images', href: '/image' },
      secondaryLink: { label: 'See profiles', href: '/profile' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Move through images, profiles, and useful content with a stronger visual rhythm.',
      description: 'Discover new visual posts, open profile pages, and browse curated sections through one polished editorial system.',
      primaryCta: { label: 'Open Gallery', href: '/image' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About the platform',
    title: 'A creative platform built for image-first publishing and polished discovery.',
    description: `${slot4BrandConfig.siteName} brings together visual storytelling, profile presentation, and structured content browsing so the whole experience feels cinematic, useful, and easy to explore.`,
    paragraphs: [
      'The site is designed to support image-led posts, curated resources, and supporting sections without forcing every route into the same layout.',
      'Instead of treating content like a simple feed, the platform uses stronger hierarchy, larger media moments, and clearer action paths so visitors can move through the site with more momentum.',
      'Each section is shaped to feel more intentional on its own while still staying connected to the larger visual system.',
    ],
    values: [
      {
        title: 'Creative-first presentation',
        description: 'Large media, stronger contrast, and cleaner spacing help every page feel more deliberate from the first scroll.',
      },
      {
        title: 'Flexible content structure',
        description: 'Image posts, profiles, articles, listings, and resources each get layouts that suit their content instead of sharing one generic pattern.',
      },
      {
        title: 'Clear discovery flow',
        description: 'Search, filters, related content, and action buttons stay easy to use while the presentation remains visually strong.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what you are planning, publishing, or refining next.',
    description: 'Use the contact page for collaborations, editorial inquiries, profile updates, gallery requests, or general questions. The layout keeps the page helpful without losing the site’s visual identity.',
    formTitle: 'Send a note',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search visual posts, profiles, articles, and connected content across the site.',
    },
    hero: {
      badge: 'Search the collection',
      title: 'Find images, profiles, stories, and useful pages faster.',
      description: 'Search by keyword, category, or content type across every active section of the site.',
      placeholder: 'Search by title, keyword, category, or topic',
    },
    resultsTitle: 'Recently searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Member access',
      title: 'Sign in to open the publishing desk.',
      description: 'Use your account to start a draft, prepare post details, and save new content ideas for the site.',
    },
    hero: {
      badge: 'Publishing desk',
      title: 'Create polished entries for every active section.',
      description: 'Choose a content lane, add the key details, and prepare a post with title, summary, links, images, and supporting content.',
    },
    formTitle: 'Post details',
    submitLabel: 'Save draft',
    successTitle: 'Draft saved successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member sign in',
      title: 'Return to your publishing space.',
      description: 'Login to browse, create drafts, and keep your place across the site’s editorial workspace.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Create access',
      title: 'Set up your account and start publishing.',
      description: 'Create an account to enter the publishing desk, save details, and prepare new posts across the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
