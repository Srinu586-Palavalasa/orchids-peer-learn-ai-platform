// app/login/login-client.tsx
"use client";

import { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "@lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        router.push("/profile"); // redirect if already logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      router.push("/profile"); // redirect after login
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-indigo-600">
      <div className="bg-white text-black rounded-xl shadow-xl p-10 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">Orchids AI</h1>
        <p className="text-center">Sign in with Google to continue</p>
        <button
          onClick={handleGoogleSignIn}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
