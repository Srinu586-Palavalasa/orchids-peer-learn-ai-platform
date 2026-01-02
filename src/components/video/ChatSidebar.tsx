"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot } from "lucide-react";

export interface Message {
    id: number;
    sender: string;
    message: string;
    type: "sent" | "received";
    isAI?: boolean;
}

interface ChatSidebarProps {
    messages: Message[];
    onSendMessage: (msg: string) => void;
    loading?: boolean;
}

export default function ChatSidebar({ messages, onSendMessage, loading }: ChatSidebarProps) {
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wider">Session Chat</h3>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles size={12} className="text-indigo-400" />
                    <span>AI Enabled</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-10 opacity-70">
                        <p>Ask a doubt regarding the session.</p>
                        <p className="text-xs mt-2">Gemini AI is listening...</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.type === "sent" ? "items-end" : "items-start"
                                }`}
                        >
                            <div
                                className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.type === "sent"
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-secondary text-secondary-foreground rounded-bl-none"
                                    } ${msg.isAI ? "border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.1)]" : ""}`}
                            >
                                {msg.isAI ? (
                                    <div className="flex items-center gap-2 mb-1 text-xs text-indigo-300 font-bold uppercase tracking-wider">
                                        <Sparkles size={10} /> Gemini AI
                                    </div>
                                ) : null}
                                {msg.message}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                {msg.sender === "You" ? "You" : msg.sender}
                            </span>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex items-start">
                        <div className="bg-secondary/50 rounded-lg p-3 rounded-bl-none">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-border bg-card">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        className="w-full bg-secondary/50 border border-border rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 transition-all"
                        placeholder="Ask a doubt..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button
                        className="absolute right-1.5 p-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
