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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

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
  <div className="flex flex-col h-screen bg-gray-900 bg-fixed text-white">
    {/* Navbar */}
    <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 shadow-lg">
      <h1 className="text-xl font-bold">🤖 AI Chat</h1>
      {/* Menu Button (Visible on Mobile Only) */}
      <button
        className="md:hidden bg-white text-blue-500 px-4 py-2 rounded shadow"
        onClick={toggleSidebar}
      >
        Menu
      </button>
    </div>

    <div className="flex flex-1">
      {/* Sidebar (Sliding Rooms List) */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4 border-r border-gray-700 overflow-y-auto transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50 w-64 md:static md:translate-x-0`}
      >
        <h2 className="text-lg font-bold mb-4">Rooms</h2>
        <ul className="space-y-2">
          {rooms.map((room, idx) => (
            <li
              key={idx}
              className={`p-3 rounded-lg cursor-pointer transition ${
                room === roomId
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => {
                openRoom(room);
                setIsSidebarOpen(false); // Close sidebar after selecting a room
              }}
            >
              {room}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <input
            className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          <button
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg w-full mt-3 shadow-lg hover:opacity-90"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto flex flex-col-reverse space-y-4 pb-20">
          <ul className="space-y-4">
            {messages.map((msg, idx) => (
              <li
                key={idx}
                className={`p-4 rounded-lg max-w-sm shadow-lg ${
                  msg.userId === user.email
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white self-end ml-auto"
                    : "bg-gray-700 text-white self-start mr-auto"
                }`}
              >
                <strong className="block text-sm text-gray-300">
                  {msg.userName}
                </strong>
                <p className="mt-1">{msg.content}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex gap-2 fixed bottom-0 left-63 right-0 p-4 bg-gray-800 border-t border-gray-700">
          <input
            className="border border-gray-600 bg-gray-800 text-white p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
);
}