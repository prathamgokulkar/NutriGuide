"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

const page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    if (res.ok) {
      alert("Login successful");
      window.location.href = "/";
    } else {
      alert(res.error || "Login failed");
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>

          <div className="space-y-4">
            <input
              name="email"
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <input
              name="password"
              onChange={handleChange}
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-amber-500 py-2 px-4 rounded-md hover:bg-amber-600 transition duration-300 text-white"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
