import Layout from '../../components/Layout';
import Chat from '../../components/Chat';

export default function ChatPage() {
    return (
        <Layout>
            <div className="py-6">
                <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">
                        AI Recipe Assistant
                    </h1>
                </header>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <Chat />
                </div>
            </div>
        </Layout>
    );
}