import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
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
      <head>
        <meta
          title="Tushar Gautam - Portfolio | Web Developer | Full Stack Developer| React Developer | Next.js Developer |Backend Developer"
          description="Tushar Guatam - This is a Portfolio Website Explore all my ideas, Reviews Projects , language used and tools used. Get in touch with me for more personalized services opionions and everything "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <AuthProvider>
        <body className="flex max-w-[100vw]!important w-[100vw] flex-col bg-[#18181B]">
          <Nav />
          <Suspense fallback={<Loading />}>
            {children}
            <Analytics />
          </Suspense>
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
