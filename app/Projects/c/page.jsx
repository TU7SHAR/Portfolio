import Image from "next/image";
import Link from "next/link";

export default async function Project() {
  return (
    <>
      <main className="max-w-6xl mx-auto lg:px-16 px-8 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-display text-4xl sm:text-5xl mb-4">
              C
            </h1>

            <Link
              href="https://en.wikipedia.org/wiki/C_(programming_language)"
              rel="noreferrer noopener"
              className="btn-ghost inline-flex items-center px-4 py-2 text-sm"
            >
              Explore
            </Link>
          </div>

          <Image
            className="rounded-md border border-[color:rgba(244,239,230,0.1)]"
            width={900}
            height={100}
            src="/C.png"
            alt="img"
          />

          <div className="flex flex-col gap-y-6 mt-8 leading-7 text-[color:var(--ink-soft)]">
            <p>
              C is an imperative, procedural language in the ALGOL tradition. It
              has a static type system. In C, all executable code is contained
              within subroutines (also called &quot;functions&quot;, though not
              in the sense of functional programming). Function parameters are
              passed by value, although arrays are passed as pointers, i.e. the
              address of the first item in the array. Pass-by-reference is
              simulated in C by explicitly passing pointers to the thing being
              referenced.
            </p>
            <pre className="text-[color:var(--amber)]">
              *All Definations/Introductions Have been sourced from Original
              Sites!!
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
