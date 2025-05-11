"use client";

import Loader from "./loader/page";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const navigate = useRouter();
    const [isLoading, setIsLoading] = useState(false); 

    const submitGetStarted = () => {
        setIsLoading(true);
        setTimeout(() => {
            navigate.push("/chat"); // Navigate to the new route after a delay
        }, 1000);
    }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {isLoading ? (
        <Loader /> // Show the loader when isLoading is true
      ) : (
        <>
          {/* Hero Section */}
          <header className="flex flex-col items-center justify-center text-center py-20">
            <h1 className="text-5xl font-extrabold mb-6">
              Welcome to <span className="text-yellow-300">ChatApp</span>
            </h1>
            <p className="text-lg mb-8">
              Connect with your friends and family in real-time. Fast, secure, and easy to use.
            </p>
            <button
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
              onClick={submitGetStarted}
            >
              Get Started
            </button>
          </header>

          {/* Features Section */}
          <section className="py-16 bg-white text-black">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose ChatApp?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4">Real-Time Messaging</h3>
                  <p>Experience instant communication with your loved ones, no matter where they are.</p>
                </div>
                <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4">Secure & Private</h3>
                  <p>Your conversations are encrypted and safe from prying eyes.</p>
                </div>
                <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4">Easy to Use</h3>
                  <p>Our intuitive interface makes chatting simple and enjoyable for everyone.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-black text-white py-6">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <p>&copy; {new Date().getFullYear()} ChatApp. All rights reserved.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}