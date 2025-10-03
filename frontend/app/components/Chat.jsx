"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';     

const Chat = () => {
    const { data: session } = useSession();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! I'm NutriGuide. What kind of recipe are you looking for today?" }
    ]);
    const [sessionId, setSessionId] = useState(null)

    // Generate a unique ID for thus chat session when the component loads
    useEffect(() => {
        setSessionId(crypto.randomUUID());
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/recipes/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: input,
                    user_id: session.user.id,
                    session_id: sessionId
                }),
            });

            if (!res.ok) {
                throw new Error('Something went wrong with the request.');
            }

            const data = await res.json();
            const botMessage = { sender: 'bot', text: data.response };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Failed to fetch response:", error);
            const errorMessage = { sender: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
            {/* Message Display Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`my-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-md ${msg.sender === 'user' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="my-2 flex justify-start">
                        <div className="p-3 rounded-lg bg-gray-200 text-gray-500">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for a recipe..."
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:bg-gray-400"
                        disabled={isLoading}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;