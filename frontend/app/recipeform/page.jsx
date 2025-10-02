"use client";
import { useState } from "react";
import React from "react";

const page = () => {
  const [formData, setFormData] = useState({
    ingredients: "",
    category: "",
    cuisine: "",
    preferences: "",
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

    if (
      !formData.title ||
      !formData.ingredients ||
      !formData.instructions ||
      !formData.category
    ) {
      setWarning("⚠️ All fields are required");
      return;
    }

    const ingredientsArray = formData.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          ingredients: ingredientsArray,
          instructions: formData.instructions,
          category: formData.category,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Recipe submitted successfully");
        router.push("/recipes");
      } else {
        setWarning(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setWarning("⚠️ Server error, try again later");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 rounded shadow-md max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold text-center">Let us cook!</h2>

        <input
          type="text"
          name="title"
          placeholder="Ingredients"
          value={FormData.ingredients}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          rows={3}
          required
        />

        <select
          name="mealType"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        >
          <option value="" disabled>
            Select Meal Type
          </option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
          <option value="dessert">Dessert</option>
        </select>

        <select
          name="cuisine"
          value={formData.cuisine}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        >
          <option value="" disabled>
            Select Cuisine
          </option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
          <option value="dessert">Dessert</option>
        </select>

        <select
          name="preferences"
          value={formData.preferences}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        >
          <option value="" disabled>
            Select Diet Preference
          </option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
          <option value="dessert">Dessert</option>
        </select>

        <button
          type="submit"
          className="w-full bg-amber-500 py-2 px-4 rounded-md hover:bg-amber-600 transition duration-300 text-white font-semibold"
        >
          Give me a recipe
        </button>
      </form>
    </div>
  );
};

export default page;
