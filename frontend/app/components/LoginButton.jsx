"use client";
import React from "react";
import Link from "next/link";

const LoginButton = () => {
  return (
    <>
      <Link
        href={"/login"}
        className="bg-primary text-white py-2 px-6 rounded-lg font-bold transition-colors hover:bg-amber-600"
      >
        Login
      </Link>
    </>
  );
};

export default LoginButton;
