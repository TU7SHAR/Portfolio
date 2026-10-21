import site from "../utils/siteMetaData.js";

const BASE_KEYWORDS = ["Tushar Gautam", "full-stack developer", "AI engineer"];

export const absoluteUrl = (path = "/") =>
  new URL(path, site.siteUrl).toString().replace(/\/$/, path === "/" ? "/" : "");

/**
 * Builds a complete, self-contained metadata object for a page.
 *
 * Next.js shallow-merges `openGraph` / `twitter` / `alternates`, so a page that
 * only sets `title` would otherwise inherit the HOME page's canonical + OG url.
 * Every indexable page goes through this helper to get its own:
 * title (absolute, so the 55–60 char budget is exact), description,
 * self-canonical, keywords, Open Graph and Twitter tags.
 * OG/Twitter images come from the route's `opengraph-image` file.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  noindex = false,
}) {
  const url = path === "/" ? site.siteUrl : `${site.siteUrl}${path}`;

  return {
    title: { absolute: title },
    description,
    keywords: [...new Set([...keywords, ...BASE_KEYWORDS])],
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: site.shortTitle,
      locale: site.locale,
      type,
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: [site.siteUrl],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

export const breadcrumbJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${site.siteUrl}${item.path === "/" ? "" : item.path}`,
  })),
});
