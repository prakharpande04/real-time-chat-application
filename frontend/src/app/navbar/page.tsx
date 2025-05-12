"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loader from "../loader/page";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/chat");
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      router.push("/chat");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      alert("You have been logged out.");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <nav className="sticky top-0 bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              <Link href="/">
                <span className="hover:text-yellow-400">ChatApp</span>
              </Link>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/chat">
              <span className="hover:text-yellow-400 cursor-pointer transition">Chat</span>
            </Link>
            <Link href="/about">
              <span className="hover:text-yellow-400 cursor-pointer transition">About</span>
            </Link>
            {user ? (
              <>
                <span className="hover:text-yellow-400 cursor-pointer transition">
                  Welcome, {user.displayName || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="hover:text-yellow-400 cursor-pointer transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="hover:text-yellow-400 cursor-pointer transition"
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
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}