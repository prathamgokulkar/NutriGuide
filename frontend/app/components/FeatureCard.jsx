const FeatureCard = ({ icon, title, description }) => {
    return (
        // The main card container with the border and shadow effect
        <div className="flex h-full flex-col gap-4 rounded-lg border-2 border-black bg-white p-6 shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#000]">
            
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 border-2 border-black">
                {icon}
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-black">
                {title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600">
                {description}
            </p>
        </div>
    );
};

export default FeatureCard;