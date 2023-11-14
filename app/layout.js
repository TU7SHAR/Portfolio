import Footer from "./(components)/Footer";
import Nav from "./(components)/Nav";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="flex max-w-[100vw]!important w-[100vw] flex-col bg-[#18181B]">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
