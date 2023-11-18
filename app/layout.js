import { Suspense } from "react";
import Loading from "./Loading.jsx";
import "./globals.css";
import Footer from "./(components)/Footer";
import Nav from "./(components)/Nav";
import AuthProvider from "./(components)/AuthProvider.jsx";
import { NextSeo } from "next-seo";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <SEO
          title="Tushar Gautam - WebDeveloper And NextJS Javascript Specialist"
          description="A Simple , beautiful themed website using Next.js for Tech Enthusiast, this is static and responsive website all created with focus"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <AuthProvider>
        <body className="flex max-w-[100vw]!important w-[100vw] flex-col bg-[#18181B]">
          <Nav />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
