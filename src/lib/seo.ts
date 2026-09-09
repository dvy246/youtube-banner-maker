/**
 * SEO Architecture & Metadata Engine
 * Source of truth: SEO.md & PRD.md §29
 */

export const SITE_URL = 'https://ytbannerstudio.com';
export const SITE_NAME = 'YT Banner Studio';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface PageSeoConfig {
  title: string;
  description: string;
  path: string;
  robots?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  jsonLd?: object[];
}

export const NICHE_TITLES: Record<string, { name: string; title: string; desc: string }> = {
  gaming: {
    name: 'Gaming',
    title: 'Gaming Banner Templates | Mobile Safe | YTBannerStudio',
    desc: 'Free gaming YouTube channel banner templates. Tested against real mobile safe area crops, instant browser editing, and clean 2560×1440 export.',
  },
  podcast: {
    name: 'Podcast',
    title: 'Podcast Banner Templates | Studio Fit | YTBannerStudio',
    desc: 'Professional podcast YouTube banner templates. Centered safe-area typography, high contrast studio designs, and instant free 2560×1440 download.',
  },
  tech: {
    name: 'Tech',
    title: 'Tech Banner Templates | Minimal & Safe | YTBannerStudio',
    desc: 'Clean tech channel banner templates. Modern developer and hardware aesthetic, verified safe-area geometry, zero watermark or sign-up needed.',
  },
  vlog: {
    name: 'Vlog',
    title: 'Vlog Banner Templates | Aesthetic Art | YTBannerStudio',
    desc: 'Curated lifestyle and vlog banner templates. Cinematic typography, perfect mobile and desktop framing, and instant browser-based 2560×1440 export.',
  },
  music: {
    name: 'Music',
    title: 'Music Banner Templates | Lo-Fi & Beats | YTBannerStudio',
    desc: 'Custom channel banners for musicians, producers, and beats channels. Balanced compositions tested across all screen crops with zero sign-up.',
  },
  fitness: {
    name: 'Fitness',
    title: 'Fitness Banner Templates | High Impact | YTBannerStudio',
    desc: 'High-impact fitness and coaching banner templates. Bold typography positioned inside YouTube\'s safe area for verified mobile and TV rendering.',
  },
  education: {
    name: 'Education',
    title: 'Education Banner Templates | Academic | YTBannerStudio',
    desc: 'Authoritative channel art for educators and tutorial creators. Clean layouts designed to keep all text and branding visible on any device.',
  },
  lifestyle: {
    name: 'Lifestyle',
    title: 'Lifestyle Banner Templates | Minimal | YTBannerStudio',
    desc: 'Understated, minimal lifestyle channel banners. Elegant serif and sans typography framed perfectly inside the mobile safe area.',
  },
  food: {
    name: 'Food & Culinary',
    title: 'Food Banner Templates | Culinary Art | YTBannerStudio',
    desc: 'Curated food and cooking channel banners. Appetizing typography and culinary layout elements verified safe across mobile and desktop displays.',
  },
  business: {
    name: 'Business & Real Estate',
    title: 'Business Banner Templates | Agency Art | YTBannerStudio',
    desc: 'High-authority channel banners for real estate agents, agencies, and business creators. Centered safe-area layouts with zero paywalls.',
  },
  edu: {
    name: 'Education',
    title: 'Education Banner Templates | Academic | YTBannerStudio',
    desc: 'Authoritative channel art for educators and tutorial creators. Clean layouts designed to keep all text and branding visible on any device.',
  },
  life: {
    name: 'Lifestyle',
    title: 'Lifestyle Banner Templates | Minimal | YTBannerStudio',
    desc: 'Understated, minimal lifestyle channel banners. Elegant serif and sans typography framed perfectly inside the mobile safe area.',
  },
};

export const STATIC_PAGES_SEO: Record<string, { title: string; desc: string }> = {
  '/': {
    title: 'YouTube Banner Maker | Fit Every Device | YTBannerStudio',
    desc: 'The official YouTube banner maker. Resize, check safe areas, and create free channel art that fits every device without cropping.',
  },
  '/guides/youtube-banner-size': {
    title: 'YouTube Banner Size | Never Get Cut Off | YTBannerStudio',
    desc: 'The correct YouTube banner size is 2560×1440 px (min 2048×1152), max 6 MB. Safe area details, device crops, and why channel art gets cut off.',
  },
  '/guides/youtube-banner-safe-area': {
    title: 'Banner Safe Area | Stop Mobile Cropping | YTBannerStudio',
    desc: 'Understand the YouTube banner safe area. See the math proving that both official safe area numbers describe the exact same centered viewing area.',
  },
  '/guides/youtube-banner-1024-x-576': {
    title: 'Banner 1024x576 | Fix Upload Error | YTBannerStudio',
    desc: 'Why YouTube rejects 1024×576 banners. Learn the 16:9 ratio math, minimum 2048×1152 requirements, and how to upscale safely to 2560×1440 for free.',
  },
  '/guides/how-to-make-a-youtube-banner': {
    title: 'Make a YouTube Banner | Design That Fits | YTBannerStudio',
    desc: 'Learn how to make a YouTube banner that fits every device. Step-by-step layout rules, safe-area design, typography, and free browser tools.',
  },
  '/guides/how-to-choose-a-youtube-banner-template': {
    title: 'Banner Templates | Choose The Best Fit | YTBannerStudio',
    desc: 'Find the best YouTube banner template for your channel niche. Learn layout archetypes, color contrast rules, and how to customize in browser.',
  },
  '/guides/youtube-banner-background': {
    title: 'Banner Background | Aesthetic 2560x1440 | YTBannerStudio',
    desc: 'Find the perfect YouTube banner background. Learn the correct 2560x1440 dimensions, explore aesthetic ideas, and download blank templates.',
  },
  '/tools/youtube-banner-resizer': {
    title: 'YouTube Banner Resizer | Auto Fit Safe Area | YTBannerStudio',
    desc: 'Resize and crop any image to the exact 2560×1440 YouTube banner dimensions. Cover fit, mobile safe area preview, sRGB export, no signup or watermark.',
  },
  '/tools/youtube-banner-checker': {
    title: 'YouTube Banner Checker | Test Crops | YTBannerStudio',
    desc: 'Check your YouTube banner against mobile, desktop, tablet, and TV safe areas. Instant crop verdict and safe-area check with zero signup or watermarks.',
  },
  '/tools/youtube-banner-maker': {
    title: 'YouTube Banner Maker | Fast Free Export | YTBannerStudio',
    desc: 'Design a custom YouTube banner, safe-area verified for mobile and desktop. Curated templates, real device previews, instant free 2560×1440 export.',
  },
  '/templates': {
    title: 'Banner Templates | Free Safe Downloads | YTBannerStudio',
    desc: 'Browse verified YouTube banner templates crafted for gaming, tech, podcasting, and vlogs. Engineered to fit mobile and desktop safe areas cleanly.',
  },
  '/backgrounds': {
    title: 'Banner Backgrounds | Aesthetic 2560x1440 | YTBannerStudio',
    desc: 'Free aesthetic YouTube banner backgrounds in 2560x1440. Browse cool anime, gaming, pink, and cute backgrounds fitted to the centered mobile safe area.',
  },
  '/about': {
    title: 'About Us | Browser-First Privacy | YTBannerStudio',
    desc: 'Learn how YTBannerStudio was built to solve banner crop issues and compression artifacts using 100% in-browser HTML5 Canvas execution.',
  },
  '/contact': {
    title: 'Contact Support | Fast Response | YTBannerStudio',
    desc: 'Get in touch with the YTBannerStudio team for support, bug reports, and creator feature requests. Expected response time under 24 hours.',
  },
  '/privacy': {
    title: 'Privacy Policy | 100% Client-Side | YTBannerStudio',
    desc: 'Our privacy policy: Zero image bytes are ever transmitted over the network. 100% client-side processing, sessionStorage usage, and advertising disclosures.',
  },
  '/terms': {
    title: 'Terms of Service | Keep Your Rights | YTBannerStudio',
    desc: 'Terms of Service for YTBannerStudio. Free for personal and commercial channel branding. Creators retain 100% ownership of their artwork.',
  },
  '/404': {
    title: 'Page Not Found | Return To Tools | YTBannerStudio',
    desc: 'The requested page could not be found. Return to YouTube Banner Maker tools and sizing guides.',
  },
};

/**
 * Validates title length (≤ 60 chars) and description length (≤ 155 chars)
 */
export function validateMetadataLength(title: string, description: string): {
  titleValid: boolean;
  descValid: boolean;
  titleLen: number;
  descLen: number;
} {
  return {
    titleValid: title.length <= 60,
    descValid: description.length <= 155,
    titleLen: title.length,
    descLen: description.length,
  };
}

/**
 * Returns self-referential canonical URL
 * Parameterized query strings must strip to clean URL per Decision D-11 & SEO.md §3.3
 */
export function getCanonicalUrl(pathname: string): string {
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/';
  return cleanPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${cleanPath}`;
}

/**
 * WebSite schema
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: 'Free, browser-based YouTube banner maker, resizer, and safe-area checker.',
    inLanguage: 'en-US',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

/**
 * Organization schema
 * Real entity info only; no fabricated data
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.svg`,
      width: 240,
      height: 48,
    },
    sameAs: [
      'https://github.com/dvy246',
      'https://ko-fi.com/divyyadav',
    ],
  };
}

/**
 * TechArticle schema for in-depth engineering and sizing guides
 */
export function getTechArticleSchema(options: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  inLanguage?: string;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${SITE_URL}${options.path}#article`,
    headline: options.title,
    description: options.description,
    url: `${SITE_URL}${options.path}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${options.path}`,
    },
    inLanguage: options.inLanguage || 'en-US',
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    author: {
      '@type': 'Organization',
      name: options.authorName || 'YTBannerStudio Editorial Team',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.svg`,
      },
    },
    image: `${SITE_URL}/og-image.png`,
    dependencies: 'HTML5 Canvas, CSS Grid, YouTube Studio Channel Customization',
    proficiencyLevel: 'Beginner to Intermediate',
  };
}

/**
 * SoftwareApplication & WebApplication schema for tool routes
 * Multi-typed to denote client-side browser utilities with 0 server dependency.
 */
export function getSoftwareAppSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires HTML5 Canvas and modern browser.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/**
 * HowTo schema for step-by-step sizing, creation, and safe area guides
 */
export function getHowToSchema(options: {
  name: string;
  description: string;
  path: string;
  steps: { name: string; text: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: options.name,
    description: options.description,
    url: `${SITE_URL}${options.path}`,
    step: options.steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/**
 * BreadcrumbList schema
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQPage schema
 * Decision D-3: Valid Q&A structure for answer extraction, no false rich-result claims.
 */
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * ContactPage schema for support and creator communications
 */
export function getContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contact#webpage`,
    url: `${SITE_URL}/contact`,
    name: 'Contact & Support — YTBannerStudio',
    description: 'Get in touch with the YTBannerStudio team for support, bug reports, and creator feature requests.',
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'support@ytbannerstudio.com',
        availableLanguage: ['en'],
      },
    },
  };
}

/**
 * CollectionPage schema for template catalogs and category pages
 */
export function getCollectionPageSchema(options: {
  name: string;
  description: string;
  path: string;
  items: { name: string; url: string; image?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}${options.path}#collection`,
    url: `${SITE_URL}${options.path}`,
    name: options.name,
    description: options.description,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: options.items.length,
      itemListElement: options.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        ...(item.image ? { image: item.image.startsWith('http') ? item.image : `${SITE_URL}${item.image}` } : {}),
      })),
    },
  };
}
