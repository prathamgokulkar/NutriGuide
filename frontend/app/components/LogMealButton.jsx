"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const LogMealButton = ({ recipeId }) => {
    const { data: session } = useSession();
    const [status, setStatus] = useState('idle');
    const router = useRouter();

    const handleLogMeal = async () => {
        if (!session?.user?.id || !recipeId) return;

        setStatus('loading');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipe_id: recipeId,
                    user_id: session.user.id,
                }),
            });

            if (!res.ok) throw new Error('Failed to log meal');
            
            setStatus('success');
            router.replace('/dashboard');

        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2000);
        }
    };

    if (status === 'success') {
        return (
            <button className="btn btn-success" disabled>
                <FiCheckCircle />
                Logged!
            </button>
        );
    }
    
    if (status === 'loading') {
        return <button className="btn is-loading" disabled>Logging...</button>;
    }

    return (
        <button className="btn btn-primary" onClick={handleLogMeal}>
            Log this Meal
        </button>
    );
};

export default LogMealButton;