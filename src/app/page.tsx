"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulate user authentication check (replace with actual logic)
    const isLoggedIn = localStorage.getItem("auth") === "true";
    if (isLoggedIn) {
      router.replace("/dashboard"); // Avoid infinite redirects
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@test.com" && password === "admin") {
      localStorage.setItem("auth", "true"); // Store authentication state
      router.replace("/dashboard"); // Redirect to dashboard
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-black">Print It</h2>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block font-medium text-black">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block font-medium text-black">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white p-3 hover:bg-blue-700 transition"
          >
            Sign In
          </button>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}