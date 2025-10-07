"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUnlock, FaGoogle } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";

const LoginPage = () => {
  const router = useRouter();
  const [warning, setWarning] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

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
    if (!formData.email || !formData.password) {
      setWarning("⚠️ Email and password are required");
      return;
    }

    const loginRes = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (loginRes.ok) {
      router.replace("/auth/callback");
    } else {
      setWarning("⚠️ Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-white shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
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
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="link link-primary font-bold">
            Sign up
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
            Log in with Google
          </button>
        </div>
        
        {warning && <div className="alert alert-warning mt-4">{warning}</div>}
      </div>
    </div>
  );
};

export default LoginPage;