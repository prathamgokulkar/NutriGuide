"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const OnboardingPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    goal: "maintenance",
    height_cm: "",
    weight_kg: "",
    age: "",
    gender: "male",
    activity_level: "sedentary",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!session?.user?.id) {
      setError("Could not get user ID. Please try logging in again.");
      setIsLoading(false);
      return;
    }

    const userId = session.user.id;

    if (!formData.height_cm || !formData.weight_kg || !formData.age) {
      setError("Please fill out your height, weight, and age.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/users/${userId}/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          height_cm: parseFloat(formData.height_cm),
          weight_kg: parseFloat(formData.weight_kg),
          age: parseInt(formData.age),
        }),
      });

      if (res.ok) {
        router.replace("/dashboard?welcome=true");
      } else {
        const data = await res.json();
        setError(data.detail || "Onboarding failed. Please try again.");
      }
    } catch (err) {
      console.error("Onboarding fetch error:", err);
      setError("Could not connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#f78c11] text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Just a few more details...</h1>
        <p className="text-lg text-center max-w-sm">
          Your answers will help us create a personalized nutrition plan tailored to your unique goals.
        </p>
      </div>

      <div className="bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Create Your Profile
          </h2>

          <ul className="steps w-full mb-8 justify-center">
            <li className="step step-warning">Sign Up</li>
            <li className="step step-warning">Profile Details</li>
          </ul>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Goal */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Your Goal
                </label>
                <select name="goal" value={formData.goal} onChange={handleChange} className="select select-bordered border-black rounded-full px-4 py-2 bg-white text-gray-700">
                  <option value="maintenance">Maintenance</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Gender
                </label>
                <select name="goal" value={formData.goal} onChange={handleChange} className="select select-bordered border-black rounded-full px-4 py-2 bg-white text-gray-700">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Height (cm)
                </label>
                <input
                  required
                  type="number"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  placeholder="e.g., 175"
                  className="select select-bordered border-black rounded-full px-4 py-2 bg-white text-gray-700" />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Weight (kg)
                </label>
                <input
                  required
                  type="number"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  placeholder="e.g., 70"
                  className="select select-bordered border-black rounded-full px-4 py-2 bg-white text-gray-700"/>
              </div>

              {/* Age */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">
                  Age
                </label>
                <input
                  required
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 25"
                  className="select select-bordered border-black rounded-full px-4 py-2 bg-white text-gray-700" />
              </div>

              {/* Activity Level */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2 flex items-center gap-2">
                   Activity Level
                </label>
                <select name="goal" value={formData.goal} onChange={handleChange} className="select select-bordered border-black rounded-full px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 ">
                  <option value="sedentary">Sedentary (little to no exercise)</option>
                  <option value="light">Light (exercise 1–3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3–5 days/week)</option>
                  <option value="active">Active (exercise 6–7 days/week)</option>
                  <option value="very_active">Very Active (hard exercise daily)</option>
                </select>
              </div>
            </div>

            {error && <div className="alert alert-warning mt-4">{error}</div>}

            {/* Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn bg-[#f78c11] hover:bg-[#e07b00] text-white w-full md:w-auto px-12 rounded-full"
              >
                {isLoading ? <span className="loading loading-spinner"></span> : "Save & Go to Dashboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
