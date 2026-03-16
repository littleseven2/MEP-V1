import type {
  SelectOption,
  ThemeConfig,
  TextStyle,
  TextStyleKey,
  ComponentType,
  ComponentSettings,
  TextBlockSettings,
  MediaSettings,
  CTASettings,
  GridSettings,
  ListSettings,
} from '../types/message';

export const defaultTextStyles: Record<TextStyleKey, TextStyle> = {
  display:     { fontSize: 56, fontWeight: 900, lineHeight: 70 },
  headline:    { fontSize: 36, fontWeight: 700, lineHeight: 45 },
  subheadline: { fontSize: 24, fontWeight: 500, lineHeight: 30 },
  title:       { fontSize: 20, fontWeight: 500, lineHeight: 30 },
  bodyLarge:   { fontSize: 18, fontWeight: 400, lineHeight: 27 },
  body:        { fontSize: 16, fontWeight: 400, lineHeight: 24 },
  label:       { fontSize: 14, fontWeight: 500, lineHeight: 19 },
  legal:       { fontSize: 12, fontWeight: 400, lineHeight: 18 },
};

export interface GradientPreset {
  id: string;
  name: string;
  color: string;
  value: string;
}

const gradientFill = 'radial-gradient(ellipse at 100% 0%, rgba(44,66,156,0.15) 14%, transparent 100%)';
function makeGradient(r: number, g: number, b: number): string {
  return `${gradientFill}, radial-gradient(ellipse at 0% 0%, rgba(${r},${g},${b},0.4) 0%, transparent 60%), #000000`;
}

export const gradientPresets: GradientPreset[] = [
  { id: 'pink',   name: 'Pink',   color: '#E75094', value: makeGradient(231, 80, 148) },
  { id: 'red',    name: 'Red',    color: '#EB3942', value: makeGradient(235, 57, 66) },
  { id: 'orange', name: 'Orange', color: '#C14D1C', value: makeGradient(193, 77, 28) },
  { id: 'amber',  name: 'Amber',  color: '#E7903E', value: makeGradient(231, 144, 62) },
  { id: 'yellow', name: 'Yellow', color: '#D89D31', value: makeGradient(216, 157, 49) },
  { id: 'green',  name: 'Green',  color: '#0C8849', value: makeGradient(12, 136, 73) },
  { id: 'cyan',   name: 'Cyan',   color: '#41B1BA', value: makeGradient(65, 177, 186) },
  { id: 'blue',   name: 'Blue',   color: '#448EF4', value: makeGradient(68, 142, 244) },
  { id: 'indigo', name: 'Indigo', color: '#5B79F1', value: makeGradient(91, 121, 241) },
  { id: 'violet', name: 'Violet', color: '#885BF1', value: makeGradient(136, 91, 241) },
  { id: 'purple', name: 'Purple', color: '#B038DC', value: makeGradient(176, 56, 220) },
  { id: 'gray',   name: 'Gray',   color: '#808080', value: makeGradient(128, 128, 128) },
];

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
      textStyles: { ...defaultTextStyles },
    },
    spacing: 'normal',
    emailPadding: 0,
    sectionPadding: 16,
    componentPadding: 0,
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
      textStyles: { ...defaultTextStyles },
    },
    spacing: 'relaxed',
    emailPadding: 4,
    sectionPadding: 24,
    componentPadding: 4,
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
      textStyles: { ...defaultTextStyles },
    },
    spacing: 'compact',
    emailPadding: 0,
    sectionPadding: 16,
    componentPadding: 0,
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
      textStyles: { ...defaultTextStyles },
    },
    spacing: 'relaxed',
    emailPadding: 8,
    sectionPadding: 28,
    componentPadding: 8,
    background: {
      type: 'gradient',
      value: 'linear-gradient(180deg, #0a4d68 0%, #05161a 100%)',
      opacity: 1,
    },
  },
];

function parseThemeRadius(theme?: ThemeConfig): number {
  if (!theme) return 0;
  return parseInt(theme.radius, 10) || 0;
}

/**
 * Returns default settings for a given component type.
 * When a theme is provided, style values (radius, colors) are derived from the theme.
 */
export function getDefaultComponentSettings(type: ComponentType, theme?: ThemeConfig): ComponentSettings {
  const r = parseThemeRadius(theme);
  const radius: [number, number, number, number] = [r, r, r, r];
  const primary = theme?.colors.primary ?? '#E50914';
  const textColor = theme?.colors.text ?? '#ffffff';

  switch (type) {
    case 'text-block': {
      const textBlockSettings: TextBlockSettings = {
        format: 'structured',
        eyebrow: { enabled: true, text: 'Eyebrow' },
        headline: { enabled: true, text: 'Headline' },
        body: { enabled: true, text: 'Body text goes here.' },
        link: { enabled: true, text: 'Learn more', url: '#' },
        callout: { enabled: false, text: 'Final Season Coming Nov 16', icon: 'horn' },
        order: ['eyebrow', 'headline', 'body', 'callout', 'link'],
        content: '<p>Start typing your content here...</p>',
        fontSize: 16,
        lineHeight: 1.6,
        color: textColor,
        alignment: 'left',
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: radius,
        strokeColor: 'transparent',
        strokeWidth: 0,
      };
      return { type: 'text-block', settings: textBlockSettings };
    }
    case 'media': {
      const mediaSettings: MediaSettings = {
        format: 'poster',
        url: '',
        alignment: 'center',
        isInteractive: false,
        mediaRadius: r,
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: radius,
        strokeColor: 'transparent',
        strokeWidth: 0,
        marquee: { enabled: false, text: 'Marquee', position: 'below' },
      };
      return { type: 'media', settings: mediaSettings };
    }
    case 'cta': {
      const ctaSettings: CTASettings = {
        layout: '1-full',
        buttons: [
          {
            enabled: true,
            text: 'Watch Now',
            url: '',
            style: 'primary',
            fillColor: primary,
            borderColor: primary,
            textColor: textColor,
          },
        ],
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: radius,
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
        itemRadius: r,
        cellStyleMode: 'whole',
        cellStyle: { padding: 0, backgroundColor: 'transparent', backgroundRadius: radius, strokeColor: 'transparent', strokeWidth: 0, imageRadius: r },
        cellStyles: [],
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: radius,
        strokeColor: 'transparent',
        strokeWidth: 0,
        marquee: { enabled: false, text: 'Marquee', position: 'below' },
      };
      return { type: 'grid', settings: gridSettings };
    }
    case 'list': {
      const listSettings: ListSettings = {
        layout: 'episodes',
        columns: 1,
        showTitle: true,
        showSubtitle: true,
        showMetadata: true,
        showThumbnail: true,
        showDivider: true,
        thumbnailType: 'image',
        thumbnailIcon: 'play',
        thumbnailRadius: r,
        iconCircleBackground: false,
        iconCircleColor: primary,
        itemCount: 'all',
        items: [
          { title: 'Stranger Things', subtitle: 'Season 5 Now Streaming', metadata: 'Watch Now' },
          { title: 'Squid Game', subtitle: 'New Season Available', metadata: 'Watch Now' },
          { title: 'Wednesday', subtitle: 'A Netflix Original Series', metadata: 'Watch Now' },
        ],
        textAlign: 'left',
        itemStyleMode: 'whole',
        itemStyle: { padding: 0, backgroundColor: 'transparent', backgroundRadius: radius, strokeColor: 'transparent', strokeWidth: 0 },
        padding: 0,
        backgroundColor: 'transparent',
        backgroundRadius: radius,
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
