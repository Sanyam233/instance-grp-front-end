import { useEffect, useState } from "react";
import "./App.css";
import { useSocket } from "./hooks/useSocket";

function App() {
  const { socket } = useSocket();
  const [name, setName] = useState<string>("N/A");
  const [zone, setZone] = useState<string>("N/A");

  const onClick = () => {
    if (!socket) {
      return;
    }
    console.log("EMITTING");
    socket.emit("vm_info");
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("vm_info", (res) => {
      const data = res["data"];
      setName(data["name"] || "No N/A");
      setZone(data["zone"] || "No N/A");
    });

    return () => {
      socket.off("vm_info");
    };
  }, [socket]);

  return (
    <div>
      <p>
        VM: {name} Zone : {zone}
      </p>
      <button onClick={onClick}>Get VM Info</button>
    </div>
  );
}

export default App;
