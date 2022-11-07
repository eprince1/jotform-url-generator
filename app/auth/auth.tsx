"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

const Auth = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const login = () => {
    //@ts-ignore
    JF.login(() => {
      //@ts-ignore
      setToken(JF.getAPIKey());
    });
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("jToken", token);
      router.push("/");
    }
  }, [token]);

  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden bg-zinc-100">
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <div className="capitalize text-gray-600 text-2xl">
            Login with <span className="font-bold ">Jotform</span> to easily
            create dynamic urls
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-gray-600 my-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            />
          </svg>
          <button
            onClick={login}
            className="px-2 py-1 text-lg rounded bg-green-600 text-white font-semibold transition-all hover:bg-green-700 hover:scale-110"
          >
            Get Started
          </button>
        </div>
      </div>
      <Script
        strategy="beforeInteractive"
        src="https://js.jotform.com/JotForm.js"
      />
    </div>
  );
};

export default Auth;
