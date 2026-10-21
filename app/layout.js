import { Analytics } from "@vercel/analytics/react";
import { Inter, Fraunces, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-devanagari",
});
import Footer from "./(components)/Footer";
import Nav from "./(components)/Nav";
import Cursor from "./(components)/Cursor.jsx";
import LivingBackground from "./(components)/three/LivingBackground.jsx";
import AuthProvider from "./(components)/AuthProvider.jsx";
import GoogleAnalytics from "./(components)/GoogleAnalytics.jsx";
import JsonLd from "./(components)/JsonLd.jsx";
import siteMetaData from "../app/utils/siteMetaData.js";

// Site-wide defaults. Every indexable page overrides title, description,
// canonical, OG and Twitter via `pageMetadata()` in app/lib/seo.js.
// OG/Twitter images come from the `opengraph-image.jsx` files.
export const metadata = {
  metadataBase: new URL(siteMetaData.siteUrl),
  title: {
    template: `%s | ${siteMetaData.shortTitle}`,
    default: siteMetaData.title,
  },
  description: siteMetaData.description,
  applicationName: siteMetaData.shortTitle,
  authors: [{ name: siteMetaData.author, url: siteMetaData.siteUrl }],
  creator: siteMetaData.author,
  publisher: siteMetaData.author,
  keywords: [
    "Tushar Gautam",
    "full-stack developer",
    "AI engineer",
    "React developer",
    "Next.js developer",
    "Flask developer",
    "RAG chatbot",
    "AI video ad generator",
    "web developer India",
  ],
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: siteMetaData.title,
    description: siteMetaData.description,
    url: siteMetaData.siteUrl,
    siteName: siteMetaData.shortTitle,
    locale: siteMetaData.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetaData.title,
    description: siteMetaData.description,
  },
  category: "technology",
};

export const viewport = {
  themeColor: "#0c0b09",
  colorScheme: "dark",
};

// JSON-LD structured data so search engines understand who this is about.
const PERSON_ID = `${siteMetaData.siteUrl}/#person`;
const personJsonLd = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Tushar Gautam",
  url: siteMetaData.siteUrl,
  image: `${siteMetaData.siteUrl}${siteMetaData.profileImage}`,
  jobTitle: siteMetaData.jobTitle,
  description: siteMetaData.description,
  email: `mailto:${siteMetaData.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kharar",
    addressRegion: "Punjab",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Rayat Bahra University, Mohali",
  },
  worksFor: { "@type": "Organization", name: "DrishInfoTech" },
  knowsAbout: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Python",
    "Flask",
    "Node.js",
    "PostgreSQL",
    "RAG",
    "Gemini API",
    "Three.js",
  ],
  sameAs: [siteMetaData.github, siteMetaData.linkedin],
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    personJsonLd,
    {
      "@type": "WebSite",
      "@id": `${siteMetaData.siteUrl}/#website`,
      url: siteMetaData.siteUrl,
      name: siteMetaData.shortTitle,
      description: siteMetaData.description,
      inLanguage: "en",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${notoDevanagari.variable}`}
    >
      <AuthProvider>
        <body className="flex min-h-screen w-full flex-col bg-[#0c0b09] font-sans antialiased">
          <JsonLd data={siteJsonLd} />
          {/* living animated backdrop (falls back to the static gradient) */}
          <div className="ambient" aria-hidden="true" />
          <LivingBackground />
          <div className="grain" aria-hidden="true" />
          <Cursor />
          <Nav />
          <div className="content-layer flex-1">
            {/* No root <Suspense>: it made dynamic pages stream a 200 before
                notFound() could run, turning missing blog posts into soft 404s. */}
            {children}
          </div>
          <Footer />
          <Analytics />
          <GoogleAnalytics />
        </body>
      </AuthProvider>
    </html>
  );
}
