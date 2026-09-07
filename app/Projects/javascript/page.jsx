import Image from "next/image";
import Link from "next/link";

export default async function Project() {
  return (
    <>
      <main className="max-w-6xl mx-auto lg:px-16 px-8 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-display text-4xl sm:text-5xl mb-4">
              JavaScript
            </h1>

            <Link
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
              rel="noreferrer noopener"
              className="btn-ghost inline-flex items-center px-4 py-2 text-sm"
            >
              Explore
            </Link>
          </div>
          <div className="flex gap-x-8">
            <Image
              className="rounded-md border border-[color:rgba(244,239,230,0.1)]"
              width={200}
              height={90}
              src="/javascript.png"
              alt="img"
            />
            <Image
              className="rounded-md border border-[color:rgba(244,239,230,0.1)]"
              width={200}
              height={90}
              src="/javascript.png"
              alt="img"
            />
            <Image
              className="rounded-md border border-[color:rgba(244,239,230,0.1)]"
              width={200}
              height={90}
              src="/javascript.png"
              alt="img"
            />
          </div>
          <div className="flex flex-col gap-y-6 mt-8 leading-7 text-[color:var(--ink-soft)]">
            <p>
              JavaScript (JS) is a lightweight interpreted (or just-in-time
              compiled) programming language with first-class functions. While
              it is most well-known as the scripting language for Web pages,
              many non-browser environments also use it, such as Node.js, Apache
              CouchDB and Adobe Acrobat. JavaScript is a prototype-based,
              multi-paradigm, single-threaded, dynamic language, supporting
              object-oriented, imperative, and declarative (e.g. functional
              programming) styles.
            </p>
            <p>
              JavaScript&apos;s dynamic capabilities include runtime object
              construction, variable parameter lists, function variables,
              dynamic script creation (via eval), object introspection (via
              for...in and Object utilities), and source-code recovery
              (JavaScript functions store their source text and can be retrieved
              through toString()).
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
