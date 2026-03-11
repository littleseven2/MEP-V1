// App view states
export type AppView = 'home' | 'setup' | 'builder';

// Channel types
export type Channel = 'email' | 'push' | 'in-app';

// Cadence types
export type Cadence = 'temporal' | 'evergreen';

// Section types
export type SectionType = 'header' | 'content' | 'footer';

// Component types
export type ComponentType = 'media' | 'text-block' | 'rich-text' | 'cta' | 'grid' | 'list';

// Netflix artwork formats + video
export type MediaFormat =
  | 'poster'
  | 'poster-art'
  | 'banner'
  | 'banner-art'
  | 'hero'
  | 'hero-art'
  | 'thumbnail'
  | 'video';

// CTA layout options
export type CTALayout =
  | '1-full'
  | '2-stacked'
  | '2-side-by-side'
  | '3-stacked-link';

// Grid layout options (legacy, kept for compatibility)
export type GridLayout =
  | '2-up'
  | '3-up'
  | '4-up'
  | '6-up'
  | '2x2'
  | '3x2'
  | '2x3';

// List layout options
export type ListLayout = 'chapters' | 'episodes' | 'schedules';

// Background configuration
export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'blur' | 'image';
  value: string;
  opacity?: number;
}

// Select option for dropdowns
export interface SelectOption {
  value: string;
  label: string;
}

// Message attributes
export interface MessageAttributes {
  name: string;
  consentCategory: string;
  messageProgram: string;
  cadence: Cadence;
  messageType: string;
  sendDate: string;
  sendTime?: string;
  endDate?: string;
  channel: Channel;
  campaign?: string;
  eligibility?: string;
}

// Individual text style definition
export interface TextStyle {
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}

// Named text style keys used in the typography scale
export type TextStyleKey = 'display' | 'headline' | 'subheadline' | 'title' | 'bodyLarge' | 'body' | 'label' | 'legal';

// Theme configuration
export interface ThemeConfig {
  id: string;
  name: string;
  radius: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  typography: {
    headlineFont: string;
    bodyFont: string;
    textStyles: Record<TextStyleKey, TextStyle>;
  };
  spacing: 'compact' | 'normal' | 'relaxed';
  sectionPadding: number;
  componentPadding: number;
  background: BackgroundConfig;
}

// Section hydration config
export interface SectionHydration {
  source: 'query' | 'collection' | 'merchandised-title' | 'custom';
  contentType?: string;
  intent?: string;
  packageType?: string;
  entityId?: string;
  collectionId?: string;
}

// Section
export interface Section {
  id: string;
  type: SectionType;
  isPrimary: boolean;
  hydration: SectionHydration;
  background: BackgroundConfig;
  padding: number;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
  conditions: unknown[];
  components: MessageComponent[];
  callout?: ComponentCallout;
  metadata?: ComponentMetadata;
  liveBadge?: ComponentLiveBadge;
  countdown?: ComponentCountdown;
  order: number;
}

// Text block element keys
export type TextBlockElement = 'eyebrow' | 'headline' | 'body' | 'link' | 'callout';

// Text block settings
export interface TextBlockSettings {
  eyebrow: { enabled: boolean; text: string };
  headline: { enabled: boolean; text: string };
  body: { enabled: boolean; text: string };
  link: { enabled: boolean; text: string; url: string };
  callout: { enabled: boolean; text: string; icon: CalloutIcon };
  order: TextBlockElement[];
  alignment: 'left' | 'center' | 'right';
  padding: number;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
}

// Media settings
export interface MediaSettings {
  format: MediaFormat;
  url: string;
  customUrl?: string;
  alignment: 'left' | 'center' | 'right';
  isInteractive: boolean;
  mediaRadius: number;
  padding: number;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
  marquee?: MarqueeConfig;
}

// CTA button config
export interface CTAButton {
  enabled: boolean;
  text: string;
  url: string;
  style: 'primary' | 'secondary' | 'text-link';
  fillColor: string;
  borderColor: string;
  textColor: string;
}

// CTA settings
export interface CTASettings {
  layout: CTALayout;
  buttons: CTAButton[];
  padding: number;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
}

// Marquee configuration (shown behind media/grid components)
export interface MarqueeConfig {
  enabled: boolean;
  text: string;
  position: 'above' | 'below';
}

// Grid cell style
export interface GridCellStyle {
  padding: number;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
  imageRadius: number;
}

// Grid item
export interface GridItem {
  entityId?: string;
  customAsset?: string;
  url: string;
  style?: GridCellStyle;
}

// Grid settings
export interface GridSettings {
  layout: GridLayout;
  spacing: boolean;
  items: GridItem[];
  splitMode: 'row' | 'column';
  rows: number[];
  cols: number[];
  gap: number;
  itemRadius: number;
  cellStyleMode: 'whole' | 'individual';
  cellStyle: GridCellStyle;
  cellStyles: GridCellStyle[];
  padding: number;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
  marquee?: MarqueeConfig;
}

// List columns
export type ListColumns = 1 | 2 | 3;

// List item
export interface ListItemStyle {
  padding: number;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
}

export interface ListItem {
  title: string;
  subtitle?: string;
  metadata?: string;
  style?: ListItemStyle;
}

// List settings
export interface ListSettings {
  layout: ListLayout;
  columns: ListColumns;
  showTitle: boolean;
  showSubtitle: boolean;
  showMetadata: boolean;
  showThumbnail: boolean;
  showDivider: boolean;
  thumbnailRadius: number;
  itemCount: 'all' | number;
  items: ListItem[];
  itemStyleMode: 'whole' | 'individual';
  itemStyle: ListItemStyle;
  padding: number;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
}

// Callout icon options
export type CalloutIcon = 'horn' | 'info' | 'star' | 'alert';

// Rich text settings
export interface RichTextSettings {
  content: string;
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  lineHeight: number;
  color: string;
  padding: number;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
}

// Component settings discriminated union
export type ComponentSettings =
  | { type: 'text-block'; settings: TextBlockSettings }
  | { type: 'rich-text'; settings: RichTextSettings }
  | { type: 'media'; settings: MediaSettings }
  | { type: 'cta'; settings: CTASettings }
  | { type: 'grid'; settings: GridSettings }
  | { type: 'list'; settings: ListSettings };

// Linked value for variable binding
export interface LinkedValue<T = string> {
  mode: 'linked' | 'custom';
  variableKey?: string;
  customValue?: T;
}

// Map of field paths to their linked state
export type LinkedValues = Record<string, LinkedValue>;

// Component-level callout (can be attached to any component)
export interface ComponentCallout {
  enabled: boolean;
  text: string;
  icon: CalloutIcon;
  position: 'above' | 'below';
}

// Component-level metadata (can be attached to any component)
export interface ComponentMetadata {
  enabled: boolean;
  items: string[];
  position: 'above' | 'below';
}

// Component-level live badge (can be attached to any component)
export interface ComponentLiveBadge {
  enabled: boolean;
  label: string;
  value: string;
  position: 'above' | 'below';
}

// Component-level countdown timer (can be attached to any component or section)
export interface ComponentCountdown {
  enabled: boolean;
  days: string;
  hours: string;
  minutes: string;
  position: 'above' | 'below';
}

// Message component
export interface MessageComponent {
  id: string;
  type: ComponentType;
  settings: ComponentSettings;
  linkedValues: LinkedValues;
  attachments: unknown[];
  callout?: ComponentCallout;
  metadata?: ComponentMetadata;
  liveBadge?: ComponentLiveBadge;
  countdown?: ComponentCountdown;
  order: number;
}

// Message
export interface Message {
  id: string;
  attributes: MessageAttributes;
  theme: ThemeConfig;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  version: number;
}
