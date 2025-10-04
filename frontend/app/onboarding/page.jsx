"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"

const Onboarding = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!session?.user?.id) {
        setError("Could not get user ID. Please try logging in again.");
        return;
    }
    const userId = session.user.id;

    // Basic validation
    if (!formData.height_cm || !formData.weight_kg || !formData.age) {
      setError("Please fill out your height, weight, and age.");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/users/${userId}/onboarding`, {
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
        // Redirect to the main dashboard after successful onboarding
        router.replace("/dashboard");
      } else {
        const data = await res.json();
        setError(data.detail || "Onboarding failed. Please try again.");
      }
    } catch (err) {
      console.error("Onboarding fetch error:", err);
      setError("Could not connect to the server. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Tell Us About Yourself
        </h2>
        <p className="text-center text-gray-500">
          This will help us personalize your nutrition plan.
        </p>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal</label>
            <select name="goal" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="maintenance">Maintenance</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input type="number" name="height_cm" onChange={handleChange} placeholder="e.g., 175" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input type="number" name="weight_kg" onChange={handleChange} placeholder="e.g., 70" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" name="age" onChange={handleChange} placeholder="e.g., 25" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Level</label>
            <select name="activity_level" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="sedentary">Sedentary (little to no exercise)</option>
              <option value="light">Light (exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (exercise 3-5 days/week)</option>
              <option value="active">Active (exercise 6-7 days/week)</option>
              <option value="very_active">Very Active (hard exercise daily)</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" className="w-full bg-amber-500 text-white py-3 rounded-md hover:bg-amber-600 transition duration-300">
          Complete Profile
        </button>
      </form>
    </div>
  );
};

export default Onboarding;