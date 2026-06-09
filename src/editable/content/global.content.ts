import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Premium visual stories and profiles',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Curated image stories and standout profiles',
    primaryLinks: [
      { label: 'Images', href: '/image' },
      { label: 'Profiles', href: '/profile' },
      { label: 'Articles', href: '/article' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get Started', href: '/image' },
      secondary: { label: 'View Contact', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Luxury editorial browsing for visual discovery',
    description: '',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Image Gallery', href: '/image' },
          { label: 'Profiles', href: '/profile' },
          { label: 'Articles', href: '/article' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Comments', href: '/comments' },
        ],
      },
    ],
    bottomNote: 'Designed for clear discovery, rich imagery, and refined reading.',
  },
  commonLabels: {
    readMore: 'Open feature',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
