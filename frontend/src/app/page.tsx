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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {isLoading ? (
        <Loader /> // Show the loader when isLoading is true
      ) : (
        <>
          {/* Hero Section */}
          <header className="flex flex-col items-center justify-center text-center py-20">
            <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-text">
              Welcome to <span className="text-yellow-300">ChatApp</span>
            </h1>
            <p className="text-lg mb-8 text-gray-300">
              Connect with your friends and family in real-time. Fast, secure, and easy to use.
            </p>
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
              onClick={submitGetStarted}
            >
              Get Started
            </button>
          </header>

          {/* Features Section */}
          <section className="py-16 bg-opacity-10 backdrop-blur-lg rounded-lg mx-6 md:mx-12 lg:mx-24">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Why Choose ChatApp?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg hover:scale-105 transition-transform">
                  <h3 className="text-2xl font-bold mb-4 text-blue-400">Real-Time Messaging</h3>
                  <p className="text-gray-300">
                    Experience instant communication with your loved ones, no matter where they are.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg hover:scale-105 transition-transform">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">Secure & Private</h3>
                  <p className="text-gray-300">
                    Your conversations are encrypted and safe from prying eyes.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg hover:scale-105 transition-transform">
                  <h3 className="text-2xl font-bold mb-4 text-green-400">Easy to Use</h3>
                  <p className="text-gray-300">
                    Our intuitive interface makes chatting simple and enjoyable for everyone.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 py-6">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <p>&copy; {new Date().getFullYear()} ChatApp. All rights reserved.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}