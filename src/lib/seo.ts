/**
 * SEO Architecture & Metadata Engine
 * Source of truth: SEO.md & PRD.md §29
 */

export const SITE_URL = 'https://youtubebannermaker.com';
export const SITE_NAME = 'YouTube Banner Maker';
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
    title: 'Gaming YouTube Banner Templates: Free & Safe for Mobile',
    desc: 'Free gaming YouTube channel banner templates. Tested against real mobile safe area crops, instant browser editing, and clean 2560×1440 export.',
  },
  podcast: {
    name: 'Podcast',
    title: 'Podcast YouTube Banner Templates: Free Safe Layouts',
    desc: 'Professional podcast YouTube banner templates. Centered safe-area typography, high contrast studio designs, and instant free 2560×1440 download.',
  },
  tech: {
    name: 'Tech',
    title: 'Tech YouTube Banner Templates: Minimal & Mobile-Safe',
    desc: 'Clean tech channel banner templates. Modern developer and hardware aesthetic, verified safe-area geometry, zero watermark or sign-up needed.',
  },
  vlog: {
    name: 'Vlog',
    title: 'Vlog YouTube Banner Templates: Aesthetic Channel Art',
    desc: 'Curated lifestyle and vlog banner templates. Cinematic typography, perfect mobile and desktop framing, and instant browser-based 2560×1440 export.',
  },
  music: {
    name: 'Music',
    title: 'Music YouTube Banner Templates: Lo-Fi, Synth & Acoustic',
    desc: 'Custom channel banners for musicians, producers, and beats channels. Balanced compositions tested across all screen crops with zero sign-up.',
  },
  fitness: {
    name: 'Fitness',
    title: 'Fitness YouTube Banner Templates: Bold & High-Contrast',
    desc: 'High-impact fitness and coaching banner templates. Bold typography positioned inside YouTube’s safe area for flawless mobile and TV rendering.',
  },
  education: {
    name: 'Education',
    title: 'Education YouTube Banner Templates: Academic & Modern',
    desc: 'Authoritative channel art for educators and tutorial creators. Clean layouts designed to keep all text and branding visible on any device.',
  },
  lifestyle: {
    name: 'Lifestyle',
    title: 'Lifestyle YouTube Banner Templates: Minimalist Art',
    desc: 'Understated, minimal lifestyle channel banners. Elegant serif and sans typography framed perfectly inside the mobile safe area.',
  },
  edu: {
    name: 'Education',
    title: 'Education YouTube Banner Templates: Academic & Modern',
    desc: 'Authoritative channel art for educators and tutorial creators. Clean layouts designed to keep all text and branding visible on any device.',
  },
  life: {
    name: 'Lifestyle',
    title: 'Lifestyle YouTube Banner Templates: Minimalist Art',
    desc: 'Understated, minimal lifestyle channel banners. Elegant serif and sans typography framed perfectly inside the mobile safe area.',
  },
};

export const STATIC_PAGES_SEO: Record<string, { title: string; desc: string }> = {
  '/': {
    title: 'Free YouTube Banner Maker — Correct on Every Device',
    desc: 'Free YouTube banner maker. Correct 2560×1440, safe-area aware, device preview, no account, no watermark. See what YouTube will cut before you upload.',
  },
  '/guides/youtube-banner-size': {
    title: 'YouTube Banner Size: 2560×1440, Safe Area & Device Crops',
    desc: 'The correct YouTube banner size is 2560×1440 px (min 2048×1152), max 6 MB. Safe area details, device crops, and why channel art gets cut off.',
  },
  '/guides/youtube-banner-safe-area': {
    title: 'YouTube Banner Safe Area Dimensions & Device Crop Guide',
    desc: 'Understand the YouTube banner safe area. See the math proving that both official safe area numbers describe the exact same centered viewing area.',
  },
  '/tools/youtube-banner-resizer': {
    title: 'YouTube Banner Resizer: Fit Any Image to 2560×1440',
    desc: 'Resize and crop any image to the exact 2560×1440 YouTube banner dimensions. Cover fit, mobile safe area preview, sRGB export, no signup or watermark.',
  },
  '/tools/youtube-banner-checker': {
    title: 'YouTube Banner Checker: Free Safe Area Crop Test',
    desc: 'Check your YouTube banner against mobile, desktop, tablet, and TV safe areas. Instant crop verdict and safe-area check with zero signup or watermarks.',
  },
  '/tools/youtube-banner-maker': {
    title: 'YouTube Banner Generator: Safe Templates for All Devices',
    desc: 'Design a custom YouTube banner that never cuts off on mobile or desktop. Curated templates, real device previews, instant free 2560×1440 export.',
  },
  '/templates': {
    title: 'Free YouTube Banner Templates: Tested for Every Device',
    desc: 'Browse verified YouTube banner templates crafted for gaming, tech, podcasting, and vlogs. Engineered to fit mobile and desktop safe areas cleanly.',
  },
  '/about': {
    title: 'About YouTubeBannerMaker — Browser-First Channel Art Utility',
    desc: 'Learn how YouTubeBannerMaker was built to solve banner crop issues and compression artifacts using 100% in-browser HTML5 Canvas execution.',
  },
  '/contact': {
    title: 'Contact & Support — YouTubeBannerMaker',
    desc: 'Get in touch with the YouTubeBannerMaker team for support, bug reports, and creator feature requests. Expected response time under 24 hours.',
  },
  '/privacy': {
    title: 'Privacy Policy — YouTubeBannerMaker',
    desc: 'Our privacy policy: Zero image bytes are ever transmitted over the network. 100% client-side processing, sessionStorage usage, and advertising disclosures.',
  },
  '/terms': {
    title: 'Terms of Service — YouTubeBannerMaker',
    desc: 'Terms of Service for YouTubeBannerMaker. Free for personal and commercial channel branding. Creators retain 100% ownership of their artwork.',
  },
  '/404': {
    title: 'Page Not Found — YouTubeBannerMaker',
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
      'https://github.com/divyyadav',
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
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  const published = options.datePublished || '2026-01-15';
  const modified = options.dateModified || '2026-03-01';
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
    inLanguage: 'en-US',
    datePublished: published,
    dateModified: modified,
    author: {
      '@type': 'Person',
      name: options.authorName || 'Divy Yadav',
      jobTitle: 'Video Operations & Channel Branding Specialist',
      worksFor: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
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
