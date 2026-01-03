"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/profile"); // redirect after login
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "50px 30px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#667eea", marginBottom: "30px" }}>Sign in</h1>

        {error && (
          <p style={{ color: "red", marginBottom: "20px", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: "bold",
            gap: "10px",
          }}
        >
          <img
            src="/google-icon.svg"
            alt="Google"
            style={{ width: 20, height: 20 }}
          />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
