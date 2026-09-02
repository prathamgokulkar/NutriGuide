"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Layout from "../../components/Layout";
import LogMealButton from "../../components/LogMealButton";
import { FiClock, FiHeart } from "react-icons/fi";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`);
          if (!res.ok) throw new Error("Recipe not found");
          const data = await res.json();
          setRecipe(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center p-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  if (!recipe) {
    return (
      <Layout>
        <div className="alert alert-error mx-auto max-w-4xl mt-10">
          Recipe not found.
        </div>
      </Layout>
    );
  }

  const parseList = (str) => {
    try {
      return str.replace(/[\[\]']/g, "").split(", ");
    } catch {
      return [];
    }
  };

  const ingredients = parseList(recipe.ingredients);
  const steps = parseList(recipe.steps);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="card bg-gray-50 shadow-lg rounded-lg overflow-hidden">
          <div className="card-body p-8">
            {/* Recipe Title */}
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{recipe.name}</h1>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <span className="flex items-center gap-2">
                <FiClock className="text-gray-500" /> {recipe.minutes} min
              </span>
              <span className="flex items-center gap-2">
                <FiHeart className="text-red-400" /> {Math.round(recipe.calories)} kcal
              </span>
            </div>

            {/* Description */}
            {recipe.description && (
              <>
                <p className="text-gray-700 mb-6">{recipe.description}</p>
              </>
            )}

            {/* Ingredients */}
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Ingredients</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              {ingredients.map((item, index) => (
                <li key={index} className="mb-1">
                  {item}
                </li>
              ))}
            </ul>

            {/* Steps */}
            <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Steps</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-700">
              {steps.map((step, index) => (
                <li key={index} className="mb-2">
                  {step}
                </li>
              ))}
            </ol>

            {/* Log Meal Button */}
            <div className="flex justify-end mt-6">
              <LogMealButton recipeId={recipe.id} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetailPage;
