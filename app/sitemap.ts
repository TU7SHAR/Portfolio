import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tushargautam.software";
  const lastModified = new Date();

  const primary = [
    { path: "", priority: 1, changeFrequency: "monthly" as const },
    { path: "/Projects", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/About", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/ContactMe", priority: 0.7, changeFrequency: "yearly" as const },
  ];

  const languagePages = [
    "/Projects/c",
    "/Projects/cpp",
    "/Projects/javascript",
    "/Projects/typescript",
  ].map((path) => ({ path, priority: 0.5, changeFrequency: "yearly" as const }));

  return [...primary, ...languagePages].map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
