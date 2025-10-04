"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// A small, reusable component for our stat cards
const StatCard = ({ title, consumed, target, unit }) => (
    <div className="stat bg-white-100 shadow rounded-lg">
        <div className="stat-title">{title}</div>
        <div className="stat-value text-2xl">{Math.round(consumed)} / {target}</div>
        <div className="stat-desc">{unit}</div>
        <progress 
            className="progress progress-primary w-full mt-2" 
            value={consumed} 
            max={target}
        ></progress>
    </div>
);

const Dashboard = () => {
    const { data: session } = useSession();
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (session?.user?.id) {
            const fetchSummary = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`http://127.0.0.1:8000/dashboard/summary/${session.user.id}`);
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.detail || 'Failed to fetch summary');
                    }
                    const data = await res.json();
                    setSummary(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchSummary();
        }
    }, [session]);

    if (isLoading) return <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="alert alert-error">Error: {error}</div>;
    if (!summary) return <div className="alert alert-info">No summary data available. Start by logging a meal!</div>;

    const chartData = {
        labels: ['Calories (kcal)', 'Protein (g)', 'Carbs (g)', 'Fats (g)'],
        datasets: [
            {
                label: 'Your Goal',
                data: [summary.target_calories, summary.target_protein, summary.target_carbs, summary.target_fats],
                backgroundColor: 'rgba(251, 191, 36, 0.4)',
                borderColor: 'rgba(251, 191, 36, 1)',
                borderWidth: 1,
            },
            {
                label: 'Your Intake',
                data: [summary.consumed_calories, summary.consumed_protein, summary.consumed_carbs, summary.consumed_fats],
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };
    
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Today\'s Nutritional Progress' },
        },
    };

    return (
        <div className="space-y-8">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Calories" consumed={summary.consumed_calories} target={summary.target_calories} unit="kcal" />
                <StatCard title="Protein" consumed={summary.consumed_protein} target={summary.target_protein} unit="grams" />
                <StatCard title="Carbohydrates" consumed={summary.consumed_carbs} target={summary.target_carbs} unit="grams" />
                <StatCard title="Fats" consumed={summary.consumed_fats} target={summary.target_fats} unit="grams" />
            </div>

            {/* Main Chart */}
            <div className="p-4 bg-white-100 shadow rounded-lg">
                <Bar options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};

export default Dashboard;