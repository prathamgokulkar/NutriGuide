import Link from 'next/link';

const Button = ({ href, className, children }) => {
    return (
        <Link 
            href={href}
            className={`group inline-flex items-center gap-x-3 rounded-full px-7 py-4 font-bold text-black transition-colors hover:bg-black hover:text-white ${className}`}
        >
            <span>
                {children}
            </span>
            <svg 
                className="h-3 w-3 transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3" 
                    d="M9 5l7 7-7 7" 
                />
            </svg>
        </Link>
    );
};

export default Button;