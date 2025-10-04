import Link from 'next/link';
import { FiGrid } from 'react-icons/fi';

const BrowseAction = () => {
    return (
        <Link href="/recipes" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border">
            <div className="card-body items-center text-center">
                <FiGrid size={32} className="text-primary mb-2" />
                <h2 className="card-title">Browse All Recipes</h2>
                <p>Explore our full recipe library.</p>
            </div>
        </Link>
    );
};

export default BrowseAction;