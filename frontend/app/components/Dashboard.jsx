"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { data: session } = useSession();
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (session?.user?.id) {
            const fetchSummary = async () => {
                try {
                    const res = await fetch(`http://127.0.0.1:8000/dashboard/summary/${session.user.id}`);
                    if (!res.ok) throw new Error('Failed to fetch summary');
                    const data = await res.json();
                    setSummary(data);
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchSummary();
        }
    }, [session]);

    if (!session) return <div>Please log in to see your dashboard.</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!summary) return <div>Loading dashboard...</div>;

    const chartData = {
        labels: ['Calories (kcal)', 'Protein (g)', 'Carbs (g)', 'Fats (g)'],
        datasets: [
            {
                label: 'Your Goal',
                data: [summary.target_calories, summary.target_protein, summary.target_carbs, summary.target_fats],
                backgroundColor: 'rgba(251, 191, 36, 0.4)', // Amber
                borderColor: 'rgba(251, 191, 36, 1)',
                borderWidth: 1,
            },
            {
                label: 'Your Intake',
                data: [summary.consumed_calories, summary.consumed_protein, summary.consumed_carbs, summary.consumed_fats],
                backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue
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
        <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Daily Summary</h2>
            <Bar options={chartOptions} data={chartData} />
        </div>
    );
};

export default Dashboard;