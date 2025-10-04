import { GiBrain, GiChart, GiNotebook } from 'react-icons/gi';
import FeatureCard from './FeatureCard'; 

// Define the features data
const features = [
    {
        icon: <GiBrain size={30} className="text-amber-500" />,
        title: "AI-Powered Recipes",
        description: "Get intelligent recipe suggestions based on natural language. Our RAG-powered assistant understands what you're looking for."
    },
    {
        icon: <GiNotebook size={30} className="text-amber-500" />,
        title: "Personalized Meal Plans",
        description: "Your profile and health goals are used to create personalized suggestions that help you achieve your targets, whether it's weight loss or muscle gain."
    },
    {
        icon: <GiChart size={30} className="text-amber-500" />,
        title: "Track Your Progress",
        description: "Log the meals you eat and visually track your daily calorie and macro intake against your personalized goals on an interactive dashboard."
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-amber-600 font-semibold tracking-wide uppercase">What you get</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Everything You Need for a Healthier Diet
                    </p>
                </div>

                <div className="mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                       <FeatureCard 
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                       />
                    ))}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;