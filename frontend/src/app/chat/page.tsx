"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

export default function ChatPage() {
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    socketInstance.on("chat message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketInstance.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket?.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🧠 Real-Time Chat</h1>
      <ul className="mt-4 space-y-2">
        {messages.map((msg, idx) => (
          <li key={idx} className="border p-2 rounded">{msg}</li>
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
