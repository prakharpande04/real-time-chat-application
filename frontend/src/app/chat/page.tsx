"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import axios from "axios";

type Message = {
  content: string;
  userId: string;
  userName: string;
  roomId?: string;
};

export default function ChatPage() {
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    const handleChatMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socketInstance.on("chat message", handleChatMessage);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        socketInstance.emit("user join", {
          userId: currentUser.email,
          username: currentUser.displayName,
          email: currentUser.email,
        });

        try {
          const response = await axios.get(
            `http://localhost:5000/api/messages?email=${currentUser.email}`
          );
          const data: Message[] = response.data;
          setAllMessages(data);

          const uniqueRooms = Array.from(
            new Set(data.map((msg) => msg.roomId))
          ) as string[];

          setRooms(uniqueRooms);

          if (uniqueRooms.length > 0) {
            const firstRoom = uniqueRooms[0];
            setRoomId(firstRoom);
            socketInstance.emit("join room", { roomId: firstRoom });
            const chatHistory = await axios.get(
              `http://localhost:5000/api/rooms/${firstRoom}/messages`
            );
            setMessages(chatHistory.data);
          }
        } catch (error) {
          console.error("Error fetching rooms or chat history:", error);
        }
      } else {
        router.push("/");
      }
    });

    return () => {
      socketInstance.off("chat message", handleChatMessage);
      unsubscribe();
    };
  }, []);

  const joinRoom = async () => {
    if (roomId.trim()) {
      socket?.emit("join room", { roomId });

      if (!rooms.includes(roomId)) {
        setRooms((prev) => [...prev, roomId]);
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/rooms/${roomId}/messages`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    }
  };

  const sendMessage = () => {
    if (message.trim() && user && roomId) {
      try {
        socket?.emit("chat message", {
          roomId,
          userId: user.email,
          userName: user.displayName,
          content: message,
        });

        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const openRoom = async (room: string) => {
    setRoomId(room);
    socket?.emit("join room", { roomId: room });
    try {
      const response = await axios.get(
        `http://localhost:5000/api/rooms/${room}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">🧠 Real-Time Chat</h1>
        <p>Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Rooms List */}
      <div className="w-1/4 bg-gray-100 text-black p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Rooms</h2>
        <ul className="space-y-2">
          {rooms.map((room, idx) => (
            <li
              key={idx}
              className={`p-2 rounded cursor-pointer ${
                room === roomId ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => openRoom(room)}
            >
              {room}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <input
            className="border p-2 w-full"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-full mt-2"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-3/4 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {messages.map((msg, idx) => (
              <li
                key={idx}
                className={`p-2 rounded max-w-xs ${
                  msg.userId === user.email
                    ? "bg-green-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-black self-start mr-auto"
                }`}
              >
                <strong>{msg.userName}:</strong> {msg.content}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex gap-2">
          <input
            className="border p-2 flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
