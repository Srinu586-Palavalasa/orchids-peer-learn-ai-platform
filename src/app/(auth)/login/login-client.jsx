"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Zap, Sparkles, ShieldCheck } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) router.replace("/");
    });
    return () => unsub();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      router.replace("/");
    } catch (err) {
      console.error("Login error", err);
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
    <div className="w-[520px] rounded-2xl bg-[#0F0F16]/95 backdrop-blur-xl border border-white/10 px-10 py-8 text-center">

      {/* App Icon */}
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center shadow-md">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-white">
        PeerLearn
      </h1>
      <p className="text-gray-400 mt-2 mb-6">
        Master any subject with peer mentorship
      </p>

      {/* Features */}
      <div className="space-y-3 text-sm text-gray-300 mb-7">
        <div className="flex items-center justify-center gap-3">
          <span className="text-indigo-400">⚡</span>
          <span>Instant Video Connections</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-purple-400">✨</span>
          <span>AI-Powered Summaries</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-emerald-400">🛡️</span>
          <span>Verified Peer Mentors</span>
        </div>
      </div>

      {/* Google Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold transition
          ${
            loading
              ? "bg-white/20 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100"
          }`}
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        {loading ? "Signing in..." : "Continue with Google"}
      </button>

      {/* Footer */}
      <p className="text-[11px] text-gray-500 mt-3">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  </div>
);

}
