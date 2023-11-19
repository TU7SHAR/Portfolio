import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options.js";
import Image from "next/image.js";
import "../globals.css";

export default async function Nav() {
  const session = await getServerSession(options);
  console.log(session ? session.user : "No User");
  return (
    <>
      <header className="  flex-0  w-[100vw] mb-20 md:mb-30">
        <div className=" max-h-[10vh] py-6 md:px-16  px-5 border-b  border-zinc-800 ">
          <nav className=" mx-auto flex items-center justify-between w-full">
            <Link href="/" className="flex">
              <Image src="/logo.png" width={25} height={25} alt="logo" />
              <span className="text-purple-400 ml-1">Tushar Gautam</span>
            </Link>
            <div className="flex gap-10 text-[#767678] flex-col sm:flex-row ">
              <Link
                href="/About"
                className="hover:text-purple-400 duration-300  res"
              >
                About
              </Link>
              <Link
                href="/Projects"
                className="hover:text-purple-400 duration-300 res"
              >
                Projects
              </Link>
              <Link
                href="/ContactMe"
                className="text-purple-400 hover:text-green-400 duration-300 res "
              >
                Contact Me
              </Link>
              {session ? (
                <div className="dropdown dropdown-end  text-[#767678] ">
                  <label
                    tabIndex={0}
                    className=" text-xl hover:text-purple-400 duration-300 "
                  >
                    Settings
                  </label>
                  <ul
                    tabIndex={0}
                    className=" bg-purple-800 text-[#adadb1]  text-xl dropdown-content z-[1] menu p-2 shadow rounded-box w-52"
                  >
                    <li>
                      <Link href="/Details" className="hover:text-white">
                        Account Details
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/About"
                        className="hover:text-white sm:hidden"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/Projects"
                        className="hover:text-white sm:hidden"
                      >
                        Projects
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ContactMe"
                        className="hover:text-white sm:hidden"
                      >
                        Contact ME
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/api/auth/signout?callbackUrl=/"
                        className="hover:text-red-500"
                      >
                        LogOut
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="dropdown dropdown-end  text-[#767678] ">
                  <label
                    tabIndex={0}
                    className=" text-xl hover:text-purple-400 duration-300 "
                  >
                    Settings
                  </label>
                  <ul
                    tabIndex={0}
                    className=" bg-purple-800 text-[#adadb1]  text-xl dropdown-content z-[1] menu p-2 shadow rounded-box w-52"
                  >
                    <li>
                      <Link
                        href="/About"
                        className="hover:text-white sm:hidden"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/Projects"
                        className="hover:text-white sm:hidden"
                      >
                        Projects
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ContactMe"
                        className="hover:text-white sm:hidden"
                      >
                        Contact Me
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/api/auth/signin?callbackUrl=/Details"
                        className="hover:text-red-500"
                      >
                        LogIn
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
