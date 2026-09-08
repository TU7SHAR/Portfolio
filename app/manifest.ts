import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tushar Gautam — Full-Stack & AI Product Engineer",
    short_name: "Tushar Gautam",
    description:
      "Portfolio of Tushar Gautam — full-stack & AI product engineer building performance-driven web apps and production AI SaaS.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0b09",
    theme_color: "#e0a049",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
