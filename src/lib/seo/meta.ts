/**
 * Shared page-metadata builder — single source of truth for title
 * formatting, description/image fallbacks, and canonical resolution.
 * Used by Base.astro so every page gets a consistent, unique
 * title/description/canonical/OG set without repeating the merge
 * logic per page. See docs/seo.md for the rules this encodes.
 */

export const SITE_NAME = "D'ouro Soulfood Bistro";

const DEFAULT_DESCRIPTION =
  "D'ouro Soulfood Bistro — Brazilian & Latin soul food in Salzburg, Austria. Fresh, flavorful, made with love.";
const DEFAULT_IMAGE = '/dourologo.png';
const DEFAULT_LOCALE = 'de_AT';

export type OgType = 'website' | 'article';

export interface PageMetaInput {
  /** Page title. Pass exactly SITE_NAME for the homepage to skip the " | " suffix. */
  title: string;
  description?: string;
  /** Path or absolute URL to the OG/Twitter image. Resolved against Astro.site. */
  image?: string;
  /** Absolute canonical URL. Defaults to the current request URL. */
  canonical?: string;
  type?: OgType;
}

export interface PageMeta {
  /** Formatted <title> content: "SITE_NAME | {title}", or just SITE_NAME on the homepage. */
  title: string;
  description: string;
  image: string;
  canonical: string;
  type: OgType;
  siteName: string;
  locale: string;
}

export function buildPageMeta(input: PageMetaInput, currentUrl: URL): PageMeta {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    canonical = currentUrl.href,
    type = 'website',
  } = input;

  const formattedTitle = title === SITE_NAME ? title : `${SITE_NAME} | ${title}`;

  return {
    title: formattedTitle,
    description,
    image,
    canonical,
    type,
    siteName: SITE_NAME,
    locale: DEFAULT_LOCALE,
  };
}
