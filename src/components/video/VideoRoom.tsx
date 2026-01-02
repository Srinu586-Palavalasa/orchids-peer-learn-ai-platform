"use client";

import React, { useRef, useEffect, useState } from "react";
import AIBot from "./AIBot";
import { useWebRTC } from "@/lib/hooks/useWebRTC";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

interface VideoRoomProps {
    roomId: string;
    isHost: boolean;
    onEndCall: () => void;
}

export default function VideoRoom({
    roomId,
    isHost,
    onEndCall,
}: VideoRoomProps) {
    const { user } = useAuth();

    const { localStream, remoteStream, error } = useWebRTC(
        roomId,
        user?.uid || "anon",
        isHost
    );

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);

    // ✅ ALWAYS keep hooks at top
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.play().catch(() => { });
        }

        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch(() => { });
        }
    }, [localStream, remoteStream]);

    const toggleMic = () => {
        if (!localStream) return;
        localStream.getAudioTracks().forEach((t) => (t.enabled = !micOn));
        setMicOn((prev) => !prev);
    };

    const toggleCamera = () => {
        if (!localStream) return;
        localStream.getVideoTracks().forEach((t) => (t.enabled = !cameraOn));
        setCameraOn((prev) => !prev);
    };

    // ✅ Error UI AFTER hooks
    if (error) {
        return (
            <div className="flex flex-col h-full bg-black rounded-xl items-center justify-center p-6 text-center">
                <div className="bg-red-500/10 p-4 rounded-full mb-4">
                    <VideoOff size={48} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                    Camera Access Failed
                </h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button onClick={onEndCall} className="btn btn-secondary">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-950 rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 ring-1 ring-white/5">
            {/* VIDEO AREA */}
            <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center">
                            <AIBot />
                            <p className="mt-4 text-gray-400 text-sm">
                                Waiting for other participants...
                            </p>
                        </div>
                    )}
                </div>

                {/* LOCAL VIDEO */}
                <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-900 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl transition-all hover:scale-105 hover:border-indigo-500/50">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-medium text-white tracking-wide">YOU</span>
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="h-20 bg-gray-900/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-6 z-10 transition-colors">
                <button
                    onClick={toggleMic}
                    className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${micOn
                        ? "bg-gray-700/50 hover:bg-gray-600 text-white shadow-lg border border-white/10"
                        : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                        }`}
                >
                    {micOn ? <Mic size={22} /> : <MicOff size={22} />}
                </button>

                <button
                    onClick={toggleCamera}
                    className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${cameraOn
                        ? "bg-gray-700/50 hover:bg-gray-600 text-white shadow-lg border border-white/10"
                        : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                        }`}
                >
                    {cameraOn ? <Video size={22} /> : <VideoOff size={22} />}
                </button>

                <div className="w-px h-8 bg-white/10 mx-2"></div>

                <button
                    onClick={onEndCall}
                    className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:rotate-90"
                >
                    <PhoneOff size={22} />
                </button>
            </div>
        </div>
    );
}
