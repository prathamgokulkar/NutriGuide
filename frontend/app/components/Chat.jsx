"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chat = () => {
    const { data: session } = useSession();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! As your personal nutrition assistant, what can I help you find today?" }
    ]);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setSessionId(crypto.randomUUID());
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || !session?.user?.id) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/recipes/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: currentInput,
                    user_id: session.user.id,
                    session_id: sessionId
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Something went wrong.');
            }

            const data = await res.json();
            const botMessage = { sender: 'bot', text: data.response };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Failed to fetch response:", error);
            const errorMessage = { sender: 'error', text: `Sorry, an error occurred: ${error.message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl h-[85vh] flex flex-col">
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-gray-800 text-lg font-semibold">💬 Hey!!</h3>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 text-white ${
                                message.sender === 'user' 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                                : message.sender === 'bot'
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                                : 'bg-gradient-to-r from-red-500 to-red-600'
                            }`}>
                                {message.sender === 'user' && '👤'}
                                {message.sender === 'bot' && '🤖'}
                                {message.sender === 'error' && '⚠️'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`px-4 py-3 rounded-2xl ${
                                    message.sender === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                    : message.sender === 'error'
                                    ? 'bg-red-50 text-red-800 border border-red-200'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                    <div className="prose prose-sm break-words">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {message.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-start gap-3 max-w-[80%]">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-lg flex-shrink-0 text-white">
                                🤖
                            </div>
                            <div className="bg-gray-100 px-4 py-3 rounded-2xl flex items-center gap-2">
                                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={session ? "Ask for a recipe..." : "Please log in to chat"}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={isLoading || !session}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading || !session}
                        className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg"
                    >
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : '➤'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;