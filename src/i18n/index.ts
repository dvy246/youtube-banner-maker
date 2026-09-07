/**
 * YouTubeBannerMaker.com — i18n & International SEO Engine
 * Handles locale routing, hreflang generation, and localized copy lookup.
 */
import { SITE_URL, STATIC_PAGES_SEO } from '../lib/seo';

export const LOCALES = ['en', 'es', 'de', 'fr', 'pt-br', 'it', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

export const TARGET_LOCALES: Locale[] = ['es', 'de', 'fr', 'pt-br', 'it', 'ja'];
export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleConfig {
  code: Locale;
  hreflang: string;
  htmlLang: string;
  ogLocale: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    hreflang: 'en',
    htmlLang: 'en',
    ogLocale: 'en_US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  es: {
    code: 'es',
    hreflang: 'es',
    htmlLang: 'es',
    ogLocale: 'es_ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  de: {
    code: 'de',
    hreflang: 'de',
    htmlLang: 'de',
    ogLocale: 'de_DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
  },
  fr: {
    code: 'fr',
    hreflang: 'fr',
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
  },
  'pt-br': {
    code: 'pt-br',
    hreflang: 'pt-BR',
    htmlLang: 'pt-BR',
    ogLocale: 'pt_BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
  },
  it: {
    code: 'it',
    hreflang: 'it',
    htmlLang: 'it',
    ogLocale: 'it_IT',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
  },
  ja: {
    code: 'ja',
    hreflang: 'ja',
    htmlLang: 'ja',
    ogLocale: 'ja_JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
  },
};

/**
 * Strips any locale prefix to return the canonical un-prefixed base route.
 * E.g., "/es/guides/youtube-banner-size" -> "/guides/youtube-banner-size"
 *       "/ja" -> "/"
 *       "/about" -> "/about"
 *       "/" -> "/"
 */
export function getCleanBasePath(pathname: string): string {
  if (!pathname) return '/';
  const clean = pathname.split('?')[0].replace(/\/$/, '') || '/';
  if (clean === '/') return '/';

  for (const loc of LOCALES) {
    if (loc === DEFAULT_LOCALE) continue;
    if (clean === `/${loc}`) return '/';
    if (clean.startsWith(`/${loc}/`)) {
      const remaining = clean.slice(loc.length + 1);
      return remaining.startsWith('/') ? remaining : `/${remaining}`;
    }
  }

  return clean;
}

/**
 * Determines the active locale from a given pathname.
 */
export function getLocaleFromPath(pathname: string): Locale {
  if (!pathname) return DEFAULT_LOCALE;
  const clean = pathname.split('?')[0].replace(/\/$/, '') || '/';
  for (const loc of LOCALES) {
    if (loc === DEFAULT_LOCALE) continue;
    if (clean === `/${loc}` || clean.startsWith(`/${loc}/`)) {
      return loc;
    }
  }
  return DEFAULT_LOCALE;
}

/**
 * Returns the localized URL path for a given base path and target locale.
 * Default locale ("en") is always un-prefixed per Decision D-09 / Prime Directive.
 */
export function getLocalizedUrl(basePath: string, targetLocale: Locale): string {
  const cleanBase = getCleanBasePath(basePath);
  if (targetLocale === DEFAULT_LOCALE) {
    return cleanBase;
  }
  return cleanBase === '/' ? `/${targetLocale}` : `/${targetLocale}${cleanBase}`;
}

/**
 * Returns the absolute localized URL for a given base path and target locale.
 */
export function getAbsoluteLocalizedUrl(basePath: string, targetLocale: Locale): string {
  const rel = getLocalizedUrl(basePath, targetLocale);
  return rel === '/' ? `${SITE_URL}/` : `${SITE_URL}${rel}`;
}

/**
 * Generates reciprocal hreflang links for a given pathname across all 7 supported locales,
 * plus the mandatory "x-default" fallback pointing to the un-prefixed English canonical.
 * Conforms strictly to Google Search Central international SEO standards.
 */
export function getHreflangLinks(
  pathname: string
): Array<{ rel: string; hreflang: string; href: string }> {
  // Non-indexable pages (e.g. 404) must not render hreflang tags
  if (pathname.includes('404')) return [];

  const links = LOCALES.map((locale) => ({
    rel: 'alternate',
    hreflang: LOCALE_CONFIG[locale].hreflang,
    href: getAbsoluteLocalizedUrl(pathname, locale),
  }));

  // Add x-default pointing to default English URL
  links.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: getAbsoluteLocalizedUrl(pathname, DEFAULT_LOCALE),
  });

  return links;
}

import { en, type Translations } from './locales/en';
import { es } from './locales/es';
import { de } from './locales/de';
import { fr } from './locales/fr';
import { ptBr } from './locales/pt-br';
import { it } from './locales/it';
import { ja } from './locales/ja';

export type { Translations };

export const TRANSLATIONS: Record<Locale, Translations> = {
  en,
  es,
  de,
  fr,
  'pt-br': ptBr,
  it,
  ja,
};

/**
 * Returns the full translation dictionary for a given locale.
 */
export function getTranslations(locale: Locale = DEFAULT_LOCALE): Translations {
  return TRANSLATIONS[locale] || TRANSLATIONS[DEFAULT_LOCALE];
}

export const getDictionary = getTranslations;

/**
 * Helper to look up a nested translation string by dot notation with optional parameter interpolation.
 * E.g. t('pt-br', 'common.brandName')
 */
export function t(
  locale: Locale,
  keyPath: string,
  params?: Record<string, string | number>
): string {
  const dict = getTranslations(locale);
  const keys = keyPath.split('.');
  let current: any = dict;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to English
      let fallback: any = TRANSLATIONS[DEFAULT_LOCALE];
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return keyPath;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current !== 'string') {
    return keyPath;
  }

  if (params) {
    let result = current;
    for (const [pk, pv] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
    }
    return result;
  }

  return current;
}

/**
 * Returns localized SEO metadata (title & description) for any static route.
 */
export function getStaticPageSeo(
  path: string,
  locale: Locale = DEFAULT_LOCALE
): { title: string; desc: string } {
  const dict = getTranslations(locale);
  const cleanPath = getCleanBasePath(path);

  switch (cleanPath) {
    case '/':
      return { title: dict.home.metaTitle, desc: dict.home.metaDesc };
    case '/about':
      return { title: dict.about.metaTitle, desc: dict.about.metaDesc };
    case '/contact':
      return { title: dict.contact.metaTitle, desc: dict.contact.metaDesc };
    case '/privacy':
      return { title: dict.privacy.metaTitle, desc: dict.privacy.metaDesc };
    case '/terms':
      return { title: dict.terms.metaTitle, desc: dict.terms.metaDesc };
    case '/guides/youtube-banner-size':
      return { title: dict.guideSize.metaTitle, desc: dict.guideSize.metaDesc };
    case '/guides/youtube-banner-safe-area':
      return { title: dict.guideSafeArea.metaTitle, desc: dict.guideSafeArea.metaDesc };
    case '/guides/youtube-banner-1024-x-576':
      return { title: dict.guide1024.metaTitle, desc: dict.guide1024.metaDesc };
    case '/guides/how-to-make-a-youtube-banner':
      return STATIC_PAGES_SEO['/guides/how-to-make-a-youtube-banner'];
    case '/guides/how-to-choose-a-youtube-banner-template':
      return STATIC_PAGES_SEO['/guides/how-to-choose-a-youtube-banner-template'];
    case '/templates':
      return { title: dict.templatesHub.metaTitle, desc: dict.templatesHub.metaDesc };
    case '/tools/youtube-banner-resizer':
      return { title: dict.tools.resizer.metaTitle, desc: dict.tools.resizer.metaDesc };
    case '/tools/youtube-banner-checker':
      return { title: dict.tools.checker.metaTitle, desc: dict.tools.checker.metaDesc };
    case '/tools/youtube-banner-maker':
      return { title: dict.tools.maker.metaTitle, desc: dict.tools.maker.metaDesc };
    case '/404':
      return { title: dict.notFound.title, desc: dict.notFound.subtitle };
    default:
      return { title: dict.home.metaTitle, desc: dict.home.metaDesc };
  }
}

/**
 * Returns localized SEO metadata for template niche pages.
 */
export function getNicheSeo(
  niche: string,
  locale: Locale = DEFAULT_LOCALE
): { name: string; title: string; desc: string } {
  const dict = getTranslations(locale);
  const nicheData = (dict.niches as any)[niche];
  if (nicheData) {
    return {
      name: nicheData.name,
      title: nicheData.title,
      desc: nicheData.desc,
    };
  }
  const fallback = (TRANSLATIONS.en.niches as any)[niche] || {
    name: niche.charAt(0).toUpperCase() + niche.slice(1),
    title: `${niche.charAt(0).toUpperCase() + niche.slice(1)} YouTube Banner Templates`,
    desc: `Free ${niche} channel banner templates. Tested against real mobile safe area crops with instant browser editing.`,
  };
  return fallback;
}

