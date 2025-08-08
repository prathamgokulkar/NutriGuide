"use client";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { FaUnlock } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FaGoogle } from "react-icons/fa6";

const page = () => {
  const router = useRouter();
  const [warning, setWarning] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setWarning("⚠️ All fields are required");
      return;
    }

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res.ok) {
      router.push("/?welcome=true");
    } else {
      setWarning("⚠️ Invalid email or password");
      router.push("/signup");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div className="space-y-4">
          <div className="relative">
            <MdAlternateEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              name="email"
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="relative">
            <FaUnlock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              name="password"
              onChange={handleChange}
              type="password"
              placeholder="Enter password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <button
                type="submit"
                className="w-full bg-amber-500 py-2 px-4 rounded-md hover:bg-amber-600 transition duration-300 text-white"
              >
                Login
              </button>

              <Link
                href="/signup"
                className="block w-full text-center bg-amber-500 py-2 px-4 rounded-md hover:bg-amber-600 transition duration-300 text-white"
              >
                Sign Up
              </Link>
            </div>

            <div className="relative">
              <FaGoogle className="absolute left-16 top-1/2 transform -translate-y-1/2 text-white" />
              <button
                className="w-full bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 text-white"
                onClick={() =>
                  signIn("google", { callbackUrl: "/?welcome=true" })
                }
              >
                Sign in with Google
              </button>
            </div>
            {warning && <div className={styles.warningBox}>{warning}</div>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default page;
