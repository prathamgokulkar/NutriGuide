import Link from 'next/link';
import { FiClock, FiHeart } from 'react-icons/fi';

const RecipeCard = ({ recipe }) => {
    return (
        <Link href={`/recipes/${recipe.id}`} className="card bg-base-100 shadow-lg hover:shadow-2xl transition-shadow duration-300 border">
            
            <div className="card-body">
                <h2 className="card-title truncate">{recipe.name}</h2>
                <div className="flex items-center justify-between text-gray-500 mt-2">
                    <div className="flex items-center gap-2">
                        <FiClock />
                        <span>{recipe.minutes} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiHeart />
                        <span>{Math.round(recipe.calories)} kcal</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;