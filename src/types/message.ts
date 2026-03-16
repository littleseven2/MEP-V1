// Padding: single number (uniform) or [top, right, bottom, left]
export type Padding = number | [number, number, number, number];

export function parsePadding(p: Padding | undefined): [number, number, number, number] {
  if (p == null) return [0, 0, 0, 0];
  if (typeof p === 'number') return [p, p, p, p];
  return p;
}

export function paddingToCss(p: Padding | undefined): string | number {
  if (p == null) return 0;
  if (typeof p === 'number') return p;
  return `${p[0]}px ${p[1]}px ${p[2]}px ${p[3]}px`;
}

export function addPadding(a: Padding | undefined, b: Padding | undefined): [number, number, number, number] {
  const pa = parsePadding(a);
  const pb = parsePadding(b);
  return [pa[0] + pb[0], pa[1] + pb[1], pa[2] + pb[2], pa[3] + pb[3]];
}

export function isUniformPadding(p: Padding | undefined): boolean {
  if (p == null || typeof p === 'number') return true;
  return p[0] === p[1] && p[1] === p[2] && p[2] === p[3];
}

export function uniformPaddingValue(p: Padding | undefined): number {
  if (p == null) return 0;
  if (typeof p === 'number') return p;
  return p[0];
}

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

// List thumbnail type
export type ListThumbnailType = 'image' | 'icon';

// Available icons for list thumbnails
export type ListThumbnailIcon =
  | 'play' | 'film' | 'tv' | 'music' | 'gamepad-2' | 'clapperboard'
  | 'star' | 'heart' | 'bookmark' | 'award' | 'trophy' | 'gem'
  | 'clock' | 'calendar' | 'bell' | 'zap' | 'flame' | 'sparkles'
  | 'user' | 'users' | 'globe' | 'map-pin' | 'compass' | 'navigation'
  | 'download' | 'share-2' | 'external-link' | 'link' | 'eye' | 'search'
  | 'check-circle' | 'info' | 'alert-circle' | 'shield' | 'lock' | 'unlock';

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
  emailPadding: Padding;
  sectionPadding: Padding;
  componentPadding: Padding;
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
  padding: Padding;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
  conditions: unknown[];
  components: MessageComponent[];
  callout?: ComponentCallout;
  metadata?: ComponentMetadata;
  liveBadge?: ComponentLiveBadge;
  countdown?: ComponentCountdown;
  attachmentOrder?: AttachmentKey[];
  sectionItemOrder?: string[];
  order: number;
}

// Attachment key type for ordering
export type AttachmentKey = 'callout' | 'metadata' | 'liveBadge' | 'countdown';

export const ATTACHMENT_KEYS: AttachmentKey[] = ['callout', 'metadata', 'liveBadge', 'countdown'];

export function isAttachmentKey(key: string): key is AttachmentKey {
  return ATTACHMENT_KEYS.includes(key as AttachmentKey);
}

export function computeSectionItemOrder(section: Section): string[] {
  if (section.sectionItemOrder) return section.sectionItemOrder;
  const order: AttachmentKey[] = section.attachmentOrder ?? ATTACHMENT_KEYS;
  const above: string[] = [];
  const below: string[] = [];
  for (const key of order) {
    const att = section[key];
    if (att?.enabled) {
      if (att.position === 'above') above.push(key);
      else below.push(key);
    }
  }
  const compIds = [...section.components]
    .sort((a, b) => a.order - b.order)
    .map((c) => c.id);
  return [...above, ...compIds, ...below];
}

export function computeComponentItemOrder(component: MessageComponent): string[] {
  if (component.contentItemOrder) return component.contentItemOrder;
  const attOrder: AttachmentKey[] = component.attachmentOrder ?? ATTACHMENT_KEYS;
  return [CONTENT_ITEM_KEY, ...attOrder];
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
  padding: Padding;
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
  padding: Padding;
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
  padding: Padding;
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
  padding: Padding;
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
  padding: Padding;
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
  padding: Padding;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
}

export interface ListItem {
  title: string;
  subtitle?: string;
  metadata?: string;
  thumbnailIcon?: ListThumbnailIcon;
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
  thumbnailType: ListThumbnailType;
  thumbnailIcon: ListThumbnailIcon;
  thumbnailRadius: number;
  iconCircleBackground: boolean;
  iconCircleColor: string;
  itemCount: 'all' | number;
  items: ListItem[];
  textAlign: 'left' | 'center' | 'right';
  itemStyleMode: 'whole' | 'individual';
  itemStyle: ListItemStyle;
  padding: Padding;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
}

// Callout icon options (legacy, kept for text-block callout field)
export type CalloutIcon = 'horn' | 'info' | 'star' | 'alert';

// Callout attachment variant
export type CalloutVariant = 'A' | 'B' | 'C' | 'D';

// Rich text settings
export interface RichTextSettings {
  content: string;
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  lineHeight: number;
  color: string;
  padding: Padding;
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
  variant: CalloutVariant;
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

// Countdown variant controls the visual layout
export type CountdownVariant = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

// Component-level countdown timer (can be attached to any component or section)
export interface ComponentCountdown {
  enabled: boolean;
  variant: CountdownVariant;
  days: string;
  hours: string;
  minutes: string;
  message: string;
  imageUrl: string;
  position: 'above' | 'below';
}

export const CONTENT_ITEM_KEY = 'content';

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
  attachmentOrder?: AttachmentKey[];
  contentItemOrder?: string[];
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
