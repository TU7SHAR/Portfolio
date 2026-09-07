import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import Loading from "./Loading.jsx";
import "./globals.css";
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
    <html lang="en">
      <AuthProvider>
        <body className="flex min-h-screen w-full flex-col bg-[#08080b]">
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
