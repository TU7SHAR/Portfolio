import { options } from "../api/auth/[...nextauth]/options.js";
import { redirect } from "next/navigation";
import Image from "next/image.js";
import Link from "next/link.js";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Details");
  }

  return (
    <>
      <div className="flex justify-center w-full text-white h-[100%] items-center flex-1 ">
        <div className="card  bg-zinc-800  shadow-xl">
          <figure className="px-10 pt-10">
            <Image
              src={session.user.image}
              height={100}
              width={300}
              alt="Image"
              className="rounded-xl"
            />
          </figure>
          <div className="card-body  items-center text-center">
            <h2 className="card-title">{session.user.name}</h2>
            <h2 className="md:font-bold text-sm font-thin  sm:text-2xl">
              {session.user.email}
            </h2>
            <p className="font-bold text-xl">{session.user.role}</p>
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
