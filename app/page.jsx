import Link from "next/link";
import HeroSvg from "./(components)/HeroSvg.jsx";
import AboutFooter from "./(components)/AboutFooter.jsx";
import { NextSeo } from "next-seo";

const page = () => {
  return (
    <>
      <NextSeo
        title="Tushar Gautam - Full Stack Developer | Home | India |Bharat"
        description="Welcome to the official website of John Doe, a full stack developer specializing in React and Node.js. Explore my portfolio, learn more about me, and get in touch."
      />
      <SEO
        title="Tushar Gautam - WebDeveloper And NextJS Javascript Specialist"
        description="A Simple , beautiful themed website using Next.js for Tech Enthusiast, this is static and responsive website all created with focus"
      />
      <main className=" text-white max-w-[100vw]  lg:px-16 px-6 flex-auto">
        <section className="flex xl:flex-row flex-col xl:items-center items-start xl:justify-center justify-between gap-x-1 lg:mt-32 mt-20 mb-16">
          <div className="">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight lg:min-w-[700px] min-w-full">
              Software engineer, Technical writer and Designer
            </h1>
            <p className="text-base text-zinc-400 leading-relaxed">
              I&apos;m Tushar Gautam, a passionate software developer
              specializing in Web-Development (Full Stack). With a knack for
              problem-solving, I love creating efficient and user-friendly
              applications, constantly seeking innovative ways to improve myself
              and the world at large
            </p>
            <ul className="flex items-center gap-x-6 my-10">
              <li>
                <Link
                  href="https://github.com/TU7SHAR"
                  rel="noreferer noopener"
                  className="hover:text-purple-400 duration-300"
                >
                  Github
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.snapchat.com/add/tusharoogautam"
                  rel="noreferer noopener"
                  className="hover:text-purple-400 duration-300"
                >
                  SnapChat
                </Link>
              </li>
              <li>
                <Link
                  href="https://discordapp.com/users/617386268745138320"
                  className="hover:text-purple-400 duration-300"
                  rel="noreferer noopener"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-purple-400 duration-300"
                  href="mailto:gautams4mail@gmail.com?subject=Redirected%20From%20Portfolio"
                  rel="noreferer noopener"
                >
                  Mail
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
