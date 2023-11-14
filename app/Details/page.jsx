import { useSession } from "next-auth/react";
import { options } from "../api/auth/[...nextauth]/options.js";
import { RedirectType, redirect } from "next/navigation";
import Image from "next/image.js";
import Link from "next/link.js";
import { getServerSession } from "next-auth";
import Footer from "../(components)/Footer.jsx";

const page = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Details");
  }

  return (
    <>
      <div className="flex justify-center w-full h-[100%] items-center flex-1 ">
        <div className="card  bg-purple-500  shadow-xl">
          <figure className="px-10 pt-10">
            <Image
              src={session.user.image}
              height={100}
              width={100}
              alt="Image"
              className="rounded-xl"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">{session.user.name}</h2>
            <h2 className="font-bold text-2xl">{session.user.email}</h2>
            <p classname="font-bold text-xl">{session.user.role}</p>
            <div className="card-actions ">
              <button className="btn btn-primary normal-case  hover:text-red-600 hover:border-red-600]">
                <Link href="/api/auth/signout?callbackUrl=/">LogOut</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
