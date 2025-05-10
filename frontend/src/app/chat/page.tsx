"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

export default function ChatPage() {
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ content: string; userId: string }[]>([]);
  const userId = "645c1f2e4f1a3b2c4d5e6f7g"; // Replace with actual user ID logic

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    // Listen for incoming messages
    socketInstance.on("chat message", (msg: { content: string; userId: string }) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketInstance.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket?.emit("chat message", { userId, content: message }); // Send userId and content
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🧠 Real-Time Chat</h1>
      <ul className="mt-4 space-y-2">
        {messages.map((msg, idx) => (
          <li key={idx} className="border p-2 rounded">
            <strong>{msg.userId}:</strong> {msg.content}
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
