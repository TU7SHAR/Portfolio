import Link from "next/link";
import HeroSvg from "./(components)/HeroSvg.jsx";
import AboutFooter from "./(components)/AboutFooter.jsx";

const page = () => {
  return (
    <>
      <main className=" text-white max-w-[100vw]  lg:px-16 px-6 flex-auto">
        <section className="flex xl:flex-row flex-col xl:items-center items-start xl:justify-center justify-between gap-x-1 lg:mt-32 mt-20 mb-16">
          <div className="">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight lg:min-w-[700px] min-w-full">
              Software engineer, Technical writer and Designer
            </h1>
            <p className="text-base text-zinc-400 leading-relaxed">
              I'm Tushar Gautam, a passionate software developer specializing in
              Web-Development (Full Stack). With a knack for problem-solving, I
              love creating efficient and user-friendly applications, constantly
              seeking innovative ways to improve myself and the world at large
            </p>
            <ul className="flex items-center gap-x-6 my-10">
              <li>
                <Link
                  href="/"
                  rel="noreferer noopener"
                  className="hover:text-purple-400 duration-300"
                >
                  Github
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  rel="noreferer noopener"
                  className="hover:text-purple-400 duration-300"
                >
                  SnapChat
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-purple-400 duration-300"
                  rel="noreferer noopener"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-purple-400 duration-300"
                  href="/"
                  rel="noreferer noopener"
                >
                  Twitch
                </Link>
              </li>
            </ul>
          </div>
          <HeroSvg />
        </section>
        <AboutFooter />
      </main>
    </>
  );
};

export default page;
