import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Fraunces, Noto_Sans_Devanagari } from "next/font/google";
import Loading from "./Loading.jsx";
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
import AuthProvider from "./(components)/AuthProvider.jsx";
import siteMetaData from "../app/utils/siteMetaData.js";

export const metadata = {
  metadataBase: new URL(siteMetaData.siteUrl),
  title: {
    template: `%s | ${siteMetaData.title}`,
    default: siteMetaData.title,
  },
  description: siteMetaData.description,
  openGraph: {
    title: siteMetaData.title,
    description: siteMetaData.description,
    url: siteMetaData.siteUrl,
    siteName: siteMetaData.title,
    images: [
      {
        url: siteMetaData.socialBanner,
      },
      {
        url: siteMetaData.altBanner,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
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
    images: siteMetaData.socialBanner,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${notoDevanagari.variable}`}
    >
      <AuthProvider>
        <body className="flex min-h-screen w-full flex-col bg-[#0c0b09] font-sans antialiased">
          {/* ambient warm backdrop + film grain (replaces the shader) */}
          <div className="ambient" aria-hidden="true" />
          <div className="grain" aria-hidden="true" />
          <Nav />
          <div className="content-layer flex-1">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
          <Footer />
          <Analytics />
        </body>
      </AuthProvider>
    </html>
  );
}
