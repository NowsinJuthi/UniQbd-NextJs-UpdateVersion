import { io } from "socket.io-client";
import { appUrl } from "./api";

let socket = null;

export const getSocket = () => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(appUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
