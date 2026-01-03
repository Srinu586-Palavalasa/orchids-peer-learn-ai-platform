// app/home-client.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import your components, hooks, auth, etc.

export default function HomeClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Client-side logic
    console.log("Home page mounted");
  }, []);

  return (
    <main className="min-h-screen w-full">
      {/* HERO */}
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold">
          Orchids Peer Learning Platform 🌸
        </h1>
        <p className="mt-4 text-gray-500">
          Learn together. Grow together.
        </p>
      </section>

      {/* ACTIONS */}
      <section className="flex justify-center gap-4">
        <button
          className="rounded bg-black px-6 py-3 text-white"
          onClick={() => router.push("/login")}
        >
          Get Started
        </button>

        <button
          className="rounded border px-6 py-3"
          onClick={() => router.push("/profile")}
        >
          Profile
        </button>
      </section>

      {/* LOADING EXAMPLE */}
      {loading && (
        <p className="mt-6 text-center text-sm text-gray-400">
          Loading...
        </p>
      )}
    </main>
  );
}
