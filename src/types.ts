export interface HeadingItem {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
}

export interface ImageItem {
  id: string;
  src: string;
  alt: string;
  hasAlt: boolean;
  isEmptyAlt: boolean;
  isDecorative: boolean;
  width?: number;
  height?: number;
}

export interface LinkItem {
  href: string;
  text: string;
  isInternal: boolean;
  isNofollow: boolean;
  hasTargetBlank: boolean;
}

export interface SchemaBlock {
  type: string;
  rawJson: string;
  isValid: boolean;
  data: any;
}

export interface CriticalIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'meta' | 'headings' | 'images' | 'links' | 'technical' | 'schema';
  title: string;
  description: string;
  fixTip: string;
  impact: string;
}

export interface SEOReport {
  url: string;
  domain: string;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  canonical: string;
  robots: string;
  viewport: string;
  charset: string;
  language: string;
  author: string;
  keywords: string;
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
  };
  twitterCard: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    site?: string;
  };
  headings: HeadingItem[];
  images: ImageItem[];
  links: {
    total: number;
    internal: number;
    external: number;
    nofollow: number;
    sampleLinks: LinkItem[];
  };
  schemaData: SchemaBlock[];
  technical: {
    isHttps: boolean;
    statusCode: number;
    loadTimeMs: number;
    wordCount: number;
    hasViewport: boolean;
    hasDoctype: boolean;
    isIndexable: boolean;
  };
  issues: CriticalIssue[];
  score: number;
  renderedContentWithTags: string;
}

export interface SimulatedTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  badge: string;
  category: string;
  html: string;
}
