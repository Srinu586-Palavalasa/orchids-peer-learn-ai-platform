"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push("/login"); // redirect if not logged in
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading profile...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#4e54c8", marginBottom: "20px" }}>Profile</h1>
        {user && (
          <>
            <p>
              <strong>Name:</strong> {user.displayName || "No Name"}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <button
              onClick={handleLogout}
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                border: "none",
                borderRadius: "6px",
                background: "#4e54c8",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
