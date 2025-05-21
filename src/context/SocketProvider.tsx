import { useState, useEffect, type ReactNode } from "react";
import io, { Socket } from "socket.io-client";
import { SocketContext } from "../hooks/useSocket";

type SocketProviderProps = {
  children: ReactNode;
};

const SocketProvider = (props: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log("HEREE", import.meta.env.VITE_BKE_SOCKET_URL);
    const newSocket = io(import.meta.env.VITE_BKE_SOCKET_URL, {
      reconnectionAttempts: 5,
      timeout: 2000,
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("connect", () => {
      console.log("Client connected!!", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Client connected!!", socket.id);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
