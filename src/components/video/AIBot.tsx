"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function AIBot() {
    const [status, setStatus] = useState("Listening...");
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        // Simulate AI behavior
        const behaviors = [
            { time: 3000, action: () => setStatus("Analyzing speech patterns...") },
            { time: 7000, action: () => setMessages(prev => [...prev, "AI: I'm generating notes for this session."]) },
            { time: 14000, action: () => setStatus("Recording key points...") },
            { time: 20000, action: () => setMessages(prev => [...prev, "AI: Don't forget to summarize the main topic."]) }
        ];

        const timers = behaviors.map(b => setTimeout(b.action, b.time));

        return () => timers.forEach(clearTimeout);
    }, []);

    // Speak messages via Web Speech API so AI can act as a listener when no humans are present
    useEffect(() => {
        if (!messages.length) return;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const last = messages[messages.length - 1];
            const utter = new SpeechSynthesisUtterance(last.replace(/^AI:\s*/i, ''));
            utter.lang = 'en-US';
            utter.rate = 1.0;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
        }
    }, [messages]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-xl border border-indigo-500/30 backdrop-blur-sm">
            <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 animate-pulse">
                    <Bot size={48} className="text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-gray-900">
                    <Sparkles size={12} className="text-white" />
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">AI Assistant</h3>
            <p className="text-indigo-300 text-sm mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
                {status}
            </p>

            <div className="w-full max-w-xs space-y-3">
                {messages.map((msg, i) => (
                    <div key={i} className="bg-gray-800/80 p-3 rounded-lg text-sm text-gray-200 border border-gray-700 fade-in">
                        {msg}
                    </div>
                ))}
            </div>
        </div>
    );
}
