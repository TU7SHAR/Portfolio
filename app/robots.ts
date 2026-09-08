import type { MetadataRoute } from "next";
import siteMetaData from "./utils/siteMetaData.js";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/Details"],
    },
    sitemap: `${siteMetaData.siteUrl}/sitemap.xml`,
    host: siteMetaData.siteUrl,
  };
}
