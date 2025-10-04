import Layout from '@/app/components/Layout';
import Dashboard from '@/app/components/Dashboard';

export default function DashboardPage() {
    return (
        <Layout>
            <div className="py-6">
                <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">
                        Your Daily Progress
                    </h1>
                </header>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <Dashboard />
                </div>
            </div>
        </Layout>
    );
}