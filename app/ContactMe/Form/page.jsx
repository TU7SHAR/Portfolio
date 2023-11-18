"use client";
import React from "react";
import Success from "../../(components)/Success.jsx";
import Fail from "../../(components)/Fail.jsx";
import { useSearchParams } from "next/navigation.js";

const page = () => {
  let value = useSearchParams().get("form");
  return (
    <>
      <main className="text-white flex w-full h-[61vh] items-center justify-center">
        <div className="card  bg-zinc-800 shadow-xl ">
          <div className="card-body">
            <h2 className="card-title text-purple-400 border-b lg:p-6 p-2 border-purple-400 border-spacing-5 flex md:text-5xl text-xl justify-center">
              ThankYou For Contacting Us!
            </h2>
            <div>{value !== "success" ? <Fail /> : <Success />}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default page;
