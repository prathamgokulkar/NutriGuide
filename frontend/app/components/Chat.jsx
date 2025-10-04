"use client";

import { useState, useEffect, useRef } from 'react'; 
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiSend } from 'react-icons/fi';

const Chat = () => {
    const { data: session } = useSession();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! As your personal nutrition assistant, what can I help you find today?" }
    ]);
    const [sessionId, setSessionId] = useState(null);

    // 2. Create a ref to track the end of the messages list
    const messagesEndRef = useRef(null);

    // Generate a unique ID for this chat session when the component loads
    useEffect(() => {
        setSessionId(crypto.randomUUID());
    }, []);

    // 3. This effect scrolls to the bottom every time the 'messages' array changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
            const errorMessage = { sender: 'bot', text: `Sorry, an error occurred: ${error.message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-3xl h-[85vh] shadow-2xl bg-base-100">
            <div className="card-body p-0 flex flex-col">
                {/* Message Display Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}>
                            <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-primary' : ''}`}>
                                {/* Wrap the component in a div with the 'prose' class */}
                                <div className="prose prose-sm">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat chat-start">
                            <div className="chat-bubble">
                                <span className="loading loading-dots loading-md"></span>
                            </div>
                        </div>
                    )}
                    {/* Empty div to mark the end for auto-scrolling */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-4 border-t bg-base-200">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={session ? "Ask for a recipe..." : "Please log in to chat"}
                            className="input input-bordered w-full"
                            disabled={isLoading || !session}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || !session}
                        >
                            <FiSend size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;