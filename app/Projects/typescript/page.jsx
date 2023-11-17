import Image from "next/image";
import Link from "next/link";

export default async function Project() {
  return (
    <main className="max-w-6xl mx-auto lg:px-16 px-8 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <h1 className="font-bold lg:text-5xl text-3xl lg:leading-tight mb-4">
            JavaScript
          </h1>

          <Link
            href="https://www.typescriptlang.org/"
            rel="noreferrer noopener"
            className="bg-[#1d1d20] text-white hover:border-zinc-700 border border-transparent rounded-md px-4 py-2"
          >
            Explore
          </Link>
        </div>
        <div className="flex gap-x-8">
          <Image
            className="rounded-2xl border border-zinc-800"
            width={200}
            height={90}
            src="/typescript.png"
            alt="img"
          />
          <Image
            className="rounded-2xl border border-zinc-800"
            width={200}
            height={90}
            src="/typescript.png"
            alt="img"
          />
          <Image
            className="rounded-2xl border border-zinc-800"
            width={200}
            height={90}
            src="/typescript.png"
            alt="img"
          />
        </div>
        <div className="flex flex-col gap-y-6 mt-8 leading-7 text-zinc-400">
          <p>
            TypeScript is a free and open-source high-level programming language
            developed by Microsoft that adds static typing with optional type
            annotations to JavaScript. It is designed for the development of
            large applications and transpiles to JavaScript.[5] Because
            TypeScript is a superset of JavaScript, all JavaScript programs are
            syntactically valid TypeScript, but they can fail to type-check for
            safety reasons.
          </p>
          <p>
            TypeScript may be used to develop JavaScript applications for both
            client-side and server-side execution (as with Node.js or Deno).
            Multiple options are available for transpilation. The default
            TypeScript Compiler can be used,[6] or the Babel compiler can be
            invoked to convert TypeScript to JavaScript.
          </p>
          <p>
            TypeScript supports definition files that can contain type
            information of existing JavaScript libraries, much like C++ header
            files can describe the structure of existing object files. This
            enables other programs to use the values defined in the files as if
            they were statically typed TypeScript entities. There are
            third-party header files for popular libraries such as jQuery,
            MongoDB, and D3.js. TypeScript headers for the Node.js library
            modules are also available, allowing development of Node.js programs
            within TypeScrip
          </p>
          <pre className="text-yellow-400">
            *All Definations/Introductions Have been sourced from Original
            Sites!!
          </pre>
        </div>
      </div>
    </main>
  );
}
