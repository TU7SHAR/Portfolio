import { NextSeo } from "next-seo";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <NextSeo
        title="Tushar Gautam - Portfolio | WebPage| Footer | Common Element"
        description="Tushar Gautam A common element in all Pages which Tells about all rights Reseved or not"
      />
      <footer className="border-t border-zinc-800 h-[10vh] flex-0 mt-20 overflow-hidden ">
        <div className="max-w-6xl  mx-auto flex lg:flex-row flex-col items-center lg:justify-between justify-center gap-y-2 md:px-16 px-6 py-8 text-zinc-400">
          <small className=" duration-200 font-mono">
            All rights reserved &copy; {new Date().getFullYear()}
          </small>

          <small className="hover:text-white duration-200">
            <Link
              href="https://github.com/TU7SHAR"
              target="_blank"
              rel="noreferrer noopener"
            >
              Prepared by <span className="text-green-400">Tushar Gautam</span>
            </Link>
          </small>
        </div>
      </footer>
    </>
  );
}
