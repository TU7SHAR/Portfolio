import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { NextSeo } from "next-seo";

export default async function Project() {
  return (
    <>
      <main className="max-w-6xl mx-auto lg:px-16 px-8 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-bold lg:text-5xl text-3xl lg:leading-tight mb-4">
              C
            </h1>

            <Link
              href="https://en.wikipedia.org/wiki/C_(programming_language)"
              rel="noreferrer noopener"
              className="bg-[#1d1d20] text-white hover:border-zinc-700 border border-transparent rounded-md px-4 py-2"
            >
              Explore
            </Link>
          </div>

          <Image
            className="rounded-2xl border border-zinc-800"
            width={900}
            height={100}
            src="/C.png"
            alt="img"
          />

          <div className="flex flex-col gap-y-6 mt-8 leading-7 text-zinc-400">
            <p>
              C is an imperative, procedural language in the ALGOL tradition. It
              has a static type system. In C, all executable code is contained
              within subroutines (also called "functions", though not in the
              sense of functional programming). Function parameters are passed
              by value, although arrays are passed as pointers, i.e. the address
              of the first item in the array. Pass-by-reference is simulated in
              C by explicitly passing pointers to the thing being referenced.
            </p>
            <pre className="text-yellow-400">
              *All Definations/Introductions Have been sourced from Original
              Sites!!
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
