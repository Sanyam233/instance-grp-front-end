import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

type SocketContextProps = {
  socket: Socket | null;
};

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};
