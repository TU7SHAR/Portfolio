import Link from "next/link";
import Image from "next/image";

const page = () => {
  return (
    <>
      <main className="flex- max-w-7xl mx-auto md:px-16 px-6 text-white">
        <section class="max-w-2xl mb-16">
          <h1 class="text-3xl font-bold tracking-tight sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight">
            Featured projects I've built over the years
          </h1>
          <p class="text-base text-zinc-400 leading-relaxed">
            I've worked on tons of little projects over the years but these are
            all on my local device sadly but i will try to make them sooner or
            later public. So till then B Bye!
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
