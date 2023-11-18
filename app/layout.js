import { Suspense } from "react";
import Loading from "./Loading.jsx";
import "./globals.css";
import Footer from "./(components)/Footer";
import Nav from "./(components)/Nav";
import AuthProvider from "./(components)/AuthProvider.jsx";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
