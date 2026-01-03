// app/profile/profile-client.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, signOut } from "@lib/firebase";
import { useRouter } from "next/navigation";

export default function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login"); // redirect if not logged in
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) return null; // prevent flicker

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-xl p-10 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full"
        />
        <p className="text-xl font-semibold">{user.displayName}</p>
        <p className="text-gray-500">{user.email}</p>
        <button
          onClick={handleSignOut}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
