// lib/socket.ts
import { io } from "socket.io-client";

let socket: any;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://13.203.198.235:5000"); // Replace with production URL
  }
  return socket;
};
