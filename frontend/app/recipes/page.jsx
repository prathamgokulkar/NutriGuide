"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import RecipeCard from '@/components/RecipeCard';

const RecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    // State for search and filter inputs
    const [searchTerm, setSearchTerm] = useState('');
    const [maxMinutes, setMaxMinutes] = useState('');
    const [maxCalories, setMaxCalories] = useState('');

    // This useEffect hook re-fetches data whenever filters or page number change
    useEffect(() => {
        const fetchRecipes = async () => {
            setIsLoading(true);
            const params = new URLSearchParams();
            
            // Add filters to the request if they have a value
            if (searchTerm) params.append('search', searchTerm);
            if (maxMinutes) params.append('max_minutes', maxMinutes);
            if (maxCalories) params.append('max_calories', maxCalories);
            params.append('page', page);
            params.append('limit', 12); // Show 12 recipes per page

            try {
                const res = await fetch(`http://127.0.0.1:8000/recipes?${params.toString()}`);
                if (!res.ok) throw new Error("Failed to fetch recipes");
                const data = await res.json();
                setRecipes(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        
        // Debounce: Wait 500ms after user stops typing to make the API call
        const timer = setTimeout(() => {
            fetchRecipes();
        }, 500);

        return () => clearTimeout(timer); // Cleanup timer on re-render

    }, [searchTerm, maxMinutes, maxCalories, page]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-6">Explore Recipes</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* --- Filter Sidebar --- */}
                    <aside className="lg:col-span-1">
                        <div className="p-4 bg-base-100 rounded-lg shadow space-y-4">
                            <h3 className="font-bold text-lg">Filters</h3>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Search by Name</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Chicken Soup" 
                                    className="input input-bordered w-full" 
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
                                    className="input input-bordered w-full" 
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
                                    className="input input-bordered w-full" 
                                    value={maxCalories}
                                    onChange={(e) => setMaxCalories(e.target.value)}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* --- Recipe Grid --- */}
                    <main className="lg:col-span-3">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {recipes.map(recipe => (
                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                ))}
                            </div>
                        )}
                        
                        {/* --- Pagination --- */}
                        <div className="flex justify-center mt-8">
                            <div className="join">
                                <button 
                                    className="join-item btn" 
                                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                >
                                    «
                                </button>
                                <button className="join-item btn">Page {page}</button>
                                <button 
                                    className="join-item btn" 
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={recipes.length < 12} // Disable if last page
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
};

export default RecipesPage;