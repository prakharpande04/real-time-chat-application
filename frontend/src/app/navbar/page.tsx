"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig"; // Import the auth instance
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loader from "../loader/page";

export default function Navbar() {
  const [user, setUser] = useState<any>(null); // State to store the authenticated user
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const router = useRouter();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the user if logged in
        router.push('/chat'); // Redirect to chat page if logged in
      } else {
        setUser(null); // Clear the user if not logged in
      }
      setIsLoading(false); // Stop loading
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [router]);

  // Handle login
  const handleLogin = async () => {
    setIsLoading(true); // Start loading
    try {
      const provider = new GoogleAuthProvider(); // Use Google as the authentication provider
      const result = await signInWithPopup(auth, provider); // Sign in with a popup
      const user = result.user;
      setUser(user); // Set the authenticated user
      router.push('/chat'); // Redirect to chat page after login
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to log in. Please try again.");
    } finally{
      setIsLoading(false); // Stop loading
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoading(true); // Start loading
    try {
      await signOut(auth);
      alert("You have been logged out.");
      router.push("/"); // Redirect to landing page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    } finally{
      setIsLoading(false); // Stop loading
    }
  };

  return (
  isLoading ? (<Loader />) : (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">
              <Link href="/">
                <span className="hover:text-yellow-400">ChatApp</span>
              </Link>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <Link href="/chat">
              <span className="hover:text-yellow-400 cursor-pointer">Chat</span>
            </Link>
            <Link href="/about">
              <span className="hover:text-yellow-400 cursor-pointer">About</span>
            </Link>
            {user ? (
              <>
                <span className="hover:text-yellow-400 cursor-pointer">
                  Welcome, {user.displayName || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="hover:text-yellow-400 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="hover:text-yellow-400 cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              {/* Add a mobile menu icon here if needed */}
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
);
}