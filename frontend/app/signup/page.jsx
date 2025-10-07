"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { IoPerson } from "react-icons/io5";
import { FaUnlock, FaGoogle } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";

const SignupPage = () => {
  const router = useRouter();
  const [warning, setWarning] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        headers: { "Content-Type": "application/json" },
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
          router.replace("/auth/callback");
        } else {
          setWarning("⚠️ Signup successful, but auto-login failed.");
        }
      } else {
        setWarning(data?.error || "⚠️ Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setWarning("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-white shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
          <label className="input input-bordered flex items-center gap-2 rounded-full bg-white border-zinc-800">
            <IoPerson className="text-gray-400" />
            <input
              type="text"
              name="name"
              className="grow"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 rounded-full bg-white border-zinc-800">
            <MdAlternateEmail className="text-gray-400" />
            <input
              type="email"
              name="email"
              className="grow"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 rounded-full bg-white border-zinc-800">
            <FaUnlock className="text-gray-400" />
            <input
              type="password"
              name="password"
              className="grow"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="bg-[#f78c11] rounded-full text-white px-4 py-2 hover:bg-[#e07b00] transition">
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="link link-primary font-bold">
            Log in
          </Link>
        </p>

        <div className="divider my-6">OR</div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="btn btn-outline rounded-full hover:bg-[#f78c11] transition"
            onClick={() => signIn("google", { callbackUrl: "/auth/callback" })}
          >
            <FaGoogle />
            Sign up with Google
          </button>
        </div>
        
        {warning && <div className="alert alert-warning mt-4">{warning}</div>}
      </div>
    </div>
  );
};

export default SignupPage;