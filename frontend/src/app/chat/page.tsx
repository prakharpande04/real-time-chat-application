"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { auth } from "@/lib/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function ChatPage() {
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ content: string; userId: string, userName: string }[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    // Listen for incoming messages
    socketInstance.on("chat message", (msg: { content: string; userId: string, userName: string }) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      socketInstance.off("chat message");
      unsubscribe();
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sendMessage = () => {
    if (message.trim() && user) {
      // Send userId (user.uid) and content
      socket?.emit("chat message", { userId: user.uid, userName: user.displayName, content: message });
      setMessage("");
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">🧠 Real-Time Chat</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={login}
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🧠 Real-Time Chat</h1>
      <div className="mb-4">
        <p>Welcome, {user.displayName}!</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {messages.map((msg, idx) => (
          <li key={idx} className="border p-2 rounded">
            <strong>{msg.userName}:</strong> {msg.content}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}