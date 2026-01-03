"use client";

import { useState, useEffect } from "react";
import { auth, provider } from "@lib/firebase";
import { signInWithPopup } from "firebase/auth";


import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) router.push("/profile");
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      router.push("/profile");
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700">
      <div className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-center text-white">
        <h1 className="text-4xl font-bold mb-2 tracking-wide">
          Orchids AI
        </h1>
        <p className="text-white/80 mb-6">
          Sign in to continue learning
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold transition
            ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-white text-black hover:scale-[1.02] hover:shadow-xl"
            }`}
        >
          {loading ? (
            <>
              <span className="loader" />
              Signing in...
            </>
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </>
          )}
        </button>

        <p className="text-xs text-white/60 mt-6">
          Secure Google authentication
        </p>
      </div>

      {/* Spinner CSS */}
      <style jsx>{`
        .loader {
          width: 18px;
          height: 18px;
          border: 3px solid #ccc;
          border-top: 3px solid #555;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
