import Link from 'next/link';
import { FiMessageSquare } from 'react-icons/fi';

const ChatAction = () => {
    return (
        <Link href="/recipes/chat" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border">
            <div className="card-body items-center text-center">
                <FiMessageSquare size={32} className="text-primary mb-2" />
                <h2 className="card-title">Chat with AI Assistant</h2>
                <p>Get personalized recipe ideas now.</p>
            </div>
        </Link>
    );
};

export default ChatAction;