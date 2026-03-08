import type {
  SelectOption,
  ThemeConfig,
  ComponentType,
  ComponentSettings,
  TextBlockSettings,
  RichTextSettings,
  MediaSettings,
  CTASettings,
  GridSettings,
  ListSettings,
} from '../types/message';

// Consent categories for message setup
export const consentCategories: SelectOption[] = [
  { value: 'pre-promote', label: 'Pre-promote' },
  { value: 'post-promote', label: 'Post-promote' },
  { value: 'account', label: 'Account' },
  { value: 'transactional', label: 'Transactional' },
  { value: 'lifecycle', label: 'Lifecycle' },
];

// Message programs
export const messagePrograms: SelectOption[] = [
  { value: 'title-launch', label: 'Title Launch' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'reactivation', label: 'Reactivation' },
  { value: 'account-health', label: 'Account Health' },
  { value: 'onboarding', label: 'Onboarding' },
];

// Message types
export const messageTypes: SelectOption[] = [
  { value: 'pre-promote', label: 'Pre-promote' },
  { value: 'premiere-reminder', label: 'Premiere Reminder' },
  { value: 'new-on-netflix', label: 'New on Netflix' },
  { value: 'you-might-like', label: 'You Might Like' },
  { value: 'continue-watching', label: 'Continue Watching' },
  { value: 'top-10', label: 'Top 10' },
];

// Content types for data hydration
export const contentTypes: SelectOption[] = [
  { value: 'movie', label: 'Movie' },
  { value: 'series', label: 'Series' },
  { value: 'episode', label: 'Episode' },
  { value: 'person', label: 'Person' },
  { value: 'collection', label: 'Collection' },
];

// Intent options for hydration
export const intentOptions: SelectOption[] = [
  { value: 'discover', label: 'Discover' },
  { value: 'engage', label: 'Engage' },
  { value: 'retain', label: 'Retain' },
  { value: 'inform', label: 'Inform' },
  { value: 'convert', label: 'Convert' },
];

// Package types for hydration
export const packageTypes: SelectOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'rich-media', label: 'Rich Media' },
];

// Default themes
export const defaultThemes: ThemeConfig[] = [
  {
    id: 'default-dark',
    name: 'Default Dark',
    radius: '8px',
    colors: {
      primary: '#E50914',
      secondary: '#564d4d',
      background: '#141414',
      text: '#ffffff',
    },
    typography: {
      headlineFont: 'Netflix Sans',
      bodyFont: 'Netflix Sans',
    },
    spacing: 'normal',
    background: {
      type: 'solid',
      value: '#141414',
      opacity: 1,
    },
  },
  {
    id: 'midnight-gradient',
    name: 'Midnight Gradient',
    radius: '12px',
    colors: {
      primary: '#E50914',
      secondary: '#2d2d2d',
      background: '#0d0d0d',
      text: '#ffffff',
    },
    typography: {
      headlineFont: 'Netflix Sans',
      bodyFont: 'Netflix Sans',
    },
    spacing: 'relaxed',
    background: {
      type: 'gradient',
      value: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d0d 100%)',
      opacity: 1,
    },
  },
  {
    id: 'netflix-red',
    name: 'Netflix Red',
    radius: '4px',
    colors: {
      primary: '#E50914',
      secondary: '#b20710',
      background: '#1a1a1a',
      text: '#ffffff',
    },
    typography: {
      headlineFont: 'Netflix Sans',
      bodyFont: 'Netflix Sans',
    },
    spacing: 'compact',
    background: {
      type: 'solid',
      value: '#1a1a1a',
      opacity: 1,
    },
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    radius: '16px',
    colors: {
      primary: '#00d4ff',
      secondary: '#0a4d68',
      background: '#05161a',
      text: '#e8f4f8',
    },
    typography: {
      headlineFont: 'Netflix Sans',
      bodyFont: 'Netflix Sans',
    },
    spacing: 'relaxed',
    background: {
      type: 'gradient',
      value: 'linear-gradient(180deg, #0a4d68 0%, #05161a 100%)',
      opacity: 1,
    },
  },
];

/**
 * Returns default settings for a given component type.
 */
export function getDefaultComponentSettings(type: ComponentType): ComponentSettings {
  switch (type) {
    case 'text-block': {
      const textBlockSettings: TextBlockSettings = {
        eyebrow: { enabled: true, text: 'Eyebrow' },
        headline: { enabled: true, text: 'Headline' },
        body: { enabled: true, text: 'Body text goes here.' },
        link: { enabled: true, text: 'Learn more', url: '#' },
        order: ['eyebrow', 'headline', 'body', 'link'],
        alignment: 'left',
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: [0, 0, 0, 0],
        strokeColor: 'transparent',
        strokeWidth: 0,
      };
      return { type: 'text-block', settings: textBlockSettings };
    }
    case 'rich-text': {
      const richTextSettings: RichTextSettings = {
        content: '<p>Start typing your content here...</p>',
        alignment: 'left',
        fontSize: 16,
        lineHeight: 1.6,
        color: '#ffffff',
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: [0, 0, 0, 0],
        strokeColor: 'transparent',
        strokeWidth: 0,
      };
      return { type: 'rich-text', settings: richTextSettings };
    }
    case 'media': {
      const mediaSettings: MediaSettings = {
        format: 'poster',
        url: '',
        alignment: 'center',
        isInteractive: false,
        mediaRadius: 8,
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: [0, 0, 0, 0],
        strokeColor: 'transparent',
        strokeWidth: 0,
      };
      return { type: 'media', settings: mediaSettings };
    }
    case 'cta': {
      const ctaSettings: CTASettings = {
        layout: '1-full',
        buttons: [
          {
            text: 'Watch Now',
            url: '',
            style: 'primary',
            fillColor: '#E50914',
            borderColor: '#E50914',
            textColor: '#ffffff',
          },
        ],
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: [0, 0, 0, 0],
        strokeColor: 'transparent',
        strokeWidth: 0,
      };
      return { type: 'cta', settings: ctaSettings };
    }
    case 'grid': {
      const gridSettings: GridSettings = {
        layout: '2-up',
        spacing: true,
        items: [],
        splitMode: 'row',
        rows: [3, 3],
        cols: [2, 2, 2],
        gap: 8,
        itemRadius: 8,
        cellStyleMode: 'whole',
        cellStyle: { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0], strokeColor: 'transparent', strokeWidth: 0 },
        cellStyles: [],
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: [0, 0, 0, 0],
        strokeColor: 'transparent',
        strokeWidth: 0,
      };
      return { type: 'grid', settings: gridSettings };
    }
    case 'list': {
      const listSettings: ListSettings = {
        layout: 'episodes',
        columns: 1,
        showDivider: true,
        showThumbnail: true,
        thumbnailRadius: 8,
        itemCount: 'all',
        items: [
          { title: 'Stranger Things', subtitle: 'Season 5 Now Streaming', metadata: 'Watch Now' },
          { title: 'Squid Game', subtitle: 'New Season Available', metadata: 'Watch Now' },
          { title: 'Wednesday', subtitle: 'A Netflix Original Series', metadata: 'Watch Now' },
        ],
        itemStyleMode: 'whole',
        itemStyle: { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0], strokeColor: 'transparent', strokeWidth: 0 },
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: [0, 0, 0, 0],
        strokeColor: 'transparent',
        strokeWidth: 0,
      };
      return { type: 'list', settings: listSettings };
    }
    default: {
      const exhaustiveCheck: never = type;
      throw new Error(`Unknown component type: ${exhaustiveCheck}`);
    }
  }
}
