import Chat from '@/app/components/Chat';

export default function Dashboard() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-50">
            <div className="w-full text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">NutriGuide</h1>
                <p className="text-lg text-gray-600 mt-2">Your AI-Powered Recipe Assistant</p>
            </div>
            <Chat />
        </main>
    );
}