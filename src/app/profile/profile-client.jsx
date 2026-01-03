"use client";

import { useEffect, useState } from "react";
import { auth } from "@lib/firebase";
import { signOut } from "firebase/auth";


import { useRouter } from "next/navigation";

export default function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-[400px] text-center">
        <div className="flex justify-center mb-4">
          <div className="p-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full bg-white"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold">{user.displayName}</h1>
        <p className="text-gray-500 mb-6">{user.email}</p>

        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
