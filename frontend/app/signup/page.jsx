"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./page.module.css";
import { IoPerson } from "react-icons/io5";
import { FaUnlock } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FaGoogle } from "react-icons/fa6";

const Signup = () => {
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

    if (!formData.name || !formData.email || !formData.password) {
      setWarning("⚠️ All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        const loginRes = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (loginRes.ok) {
          router.push("/?welcome=true");
        } else {
          setWarning("⚠️ Signup successful but login failed.");
        }
      } else {
        if (data?.error === "User already exists") {
          setWarning("⚠️ User already exists");
        } else {
          setWarning("⚠️ Signup failed");
        }
      }
    } catch (err) {
      console.error("Signup error:", err);
      setWarning("⚠️ Server error, please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <div className="space-y-4">
          <div className="relative">
            <IoPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              name="name"
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

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
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            className="w-full bg-amber-500 py-2 px-4 rounded-md hover:bg-amber-600 transition duration-300 text-white"
          >
            Sign Up
          </button>

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
      </form>
    </div>
  );
};

export default Signup;
