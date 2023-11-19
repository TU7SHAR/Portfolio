import Link from "next/link";
import Image from "next/image";
import { NextSeo } from "next-seo";
const page = () => {
  return (
    <>
      <NextSeo
        title="Tushar Gautam - Projects | Languages | Tools Used | Portfolio"
        description="Explore my portfolio of projects. As a full stack developer, I’ve worked on a range of applications, from dynamic web apps to responsive websites. I have Used a range of programing languages, frameworks , libraraies, tools a wide variety of experinces with hunger for learning"
      />{" "}
      <NextSeo
        title="Tushar Gautam - CPP | C++ | Portfolio"
        description="Explore and review my opionions on this programming language ,Article Sourced From Wikipedia, General Purpose Language CPP for building  fast speed softwares for instamce used for building trading softwares"
      />
      <NextSeo
        title="Tushar Gautam C Programming language | Project |Review |View |Portfolio"
        description="I have a special connection with this language a very annoying and rememberable one, This was my first Programming Language and i spent too much time learning this language "
      />
      <NextSeo
        title="Tushar Gautam - Projects | TypeScript | Typescript | Typescript vs Javascript | Javascript vs Typescript | Portfolio"
        description="A new emerging successor of Javascript - Typescript | Article Sourced from Typescript.org | Wikipedia"
      />
      <NextSeo
        title="Tushar Gautam - JavaScript |Javascript | js | Backend | Middleware | Frontentd | Portfolio | Review"
        description="A all rounder Langauage for building any kind of application, generally used for web development , and my favourate language"
      />
      <main className="flex- max-w-7xl mx-auto md:px-16 px-6 text-white">
        <section class="max-w-2xl mb-16">
          <h1 class="text-3xl font-bold tracking-tight sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight">
            Featured projects I&apos;ve built over the years
          </h1>
          <p class="text-base text-zinc-400 leading-relaxed">
            I&apos;ve worked on tons of little projects over the years but these
            are all on my local device sadly but i will try to make them sooner
            or later public. So till then B Bye!
          </p>
        </section>
        <section class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-12">
          <Link
            class="flex items-center gap-x-4 bg-[#1d1d20] border border-transparent hover:border-zinc-700 p-4 rounded-lg ease-in-out"
            href="/projects/c-sharp"
          >
            <Image
              src="/404.png"
              alt="img"
              loading="lazy"
              width={60}
              height={60}
            ></Image>
            <div>
              <h2 class="font-semibold mb-1">404 </h2>
              <div class="text-sm text-zinc-400">No Projects Public Yet</div>
            </div>
          </Link>
        </section>

        <section class="max-w-2xl mb-16">
          <h1 class="text-3xl font-bold tracking-tight sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight">
            Languages I have been using from Time to Time!!
          </h1>
        </section>
        <section class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-12">
          <Link
            class="flex items-center gap-x-4 bg-[#1d1d20] border border-transparent hover:border-zinc-700 p-4 rounded-lg ease-in-out"
            href="/Projects/c"
          >
            <Image
              src="/C.png"
              alt="img"
              loading="lazy"
              width={60}
              height={60}
              className="rounded-sm"
            ></Image>
            <div>
              <h2 class="font-semibold mb-1">C</h2>
              <div class="text-sm text-zinc-400">
                General-purpose programming language
              </div>
            </div>
          </Link>
          <Link
            class="flex items-center gap-x-4 bg-[#1d1d20] border border-transparent hover:border-zinc-700 p-4 rounded-lg ease-in-out"
            href="/Projects/javascript"
          >
            <Image
              src="/javascript.png"
              alt="img"
              loading="lazy"
              width={60}
              height={60}
              className="rounded-sm"
            ></Image>
            <div>
              <h2 class="font-semibold mb-1">JavaScript</h2>
              <div class="text-sm text-zinc-400">
                LightWeight Dynamic programming language
              </div>
            </div>
          </Link>
          <Link
            class="flex items-center gap-x-4 bg-[#1d1d20] border border-transparent hover:border-zinc-700 p-4 rounded-lg ease-in-out"
            href="/Projects/typescript"
          >
            <Image
              src="/typescript.png"
              alt="img"
              loading="lazy"
              width={60}
              height={60}
              className="rounded-sm"
            ></Image>
            <div>
              <h2 class="font-semibold mb-1">TypeScript</h2>
              <div class="text-sm text-zinc-400">
                TypeScript is JavaScript with syntax for types.
              </div>
            </div>
          </Link>
          <Link
            class="flex items-center gap-x-4 bg-[#1d1d20] border border-transparent hover:border-zinc-700 p-4 rounded-lg ease-in-out"
            href="/Projects/cpp"
          >
            <Image
              src="/c++.png"
              alt="img"
              loading="lazy"
              width={60}
              height={60}
              className="rounded-full"
            ></Image>
            <div>
              <h2 class="font-semibold mb-1">C++</h2>
              <div class="text-sm text-zinc-400">
                General-purpose programming language
              </div>
            </div>
          </Link>
        </section>
      </main>
    </>
  );
};

export default page;
