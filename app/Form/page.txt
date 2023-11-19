"use client";
import React from "react";
// import UserForm from "../(components)/UserForm.jsx";
// import LoginForm from "../(components)/LoginForm.jsx";
import Image from "next/image.js";
import { useSearchParams } from "next/navigation.js";

export default function Page() {
  let value = useSearchParams().get("Form");
  console.log(value);
  return (
    <>
      <section className="text-white flex w-full justify-center items-center h-[60vh]">
        <main className="max-w-7xl">
          <div className="card card-side bg-[rgba(0,0,0,0.09)] m-1  shadow-lg sm:p-5 p-3">
            <figure>
              <Image
                src="/login.png"
                alt="img"
                width={250}
                height={500}
                className="rounded-lg cursor-none"
              />
            </figure>
            <div className="card-body">
              {value !== "Registration" ? <LoginForm /> : <UserForm />}
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
