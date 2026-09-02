"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import RecipeCard from "../components/RecipeCard";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [maxMinutes, setMaxMinutes] = useState("");
  const [maxCalories, setMaxCalories] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);

      try {
        // Build request body for your POST endpoint
        const body = {
          query: searchTerm || "",
          max_minutes: maxMinutes ? parseInt(maxMinutes) : null,
          max_calories: maxCalories ? parseFloat(maxCalories) : null,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, maxMinutes, maxCalories]);

  return (
    <Layout>
      <div className="bg-white min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Recipes</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- Filter Sidebar --- */}
          <aside className="lg:col-span-1">
            <div className="p-4 bg-white rounded-lg shadow space-y-4 sticky top-6">
              <h3 className="font-bold text-lg">Filters</h3>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search by Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Chicken Soup"
                  className="input input-bordered w-full bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Max Cooking Time (min)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 30"
                  className="input input-bordered w-full bg-gray-50"
                  value={maxMinutes}
                  onChange={(e) => setMaxMinutes(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Max Calories</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 500"
                  className="input input-bordered w-full bg-gray-50"
                  value={maxCalories}
                  onChange={(e) => setMaxCalories(e.target.value)}
                />
              </div>
            </div>
          </aside>

          {/* --- Recipe Grid --- */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64 ">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recipes found matching your filters.</p>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default RecipesPage;
