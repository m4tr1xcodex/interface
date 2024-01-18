//import { PORT } from "@/config/app"
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}
export default function SocketHandler(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  const PORT = 3300;
  if (res.socket.server.io) {
    res
      .status(200)
      .json({
        success: true,
        message: "Socket is already running",
        socket: `:${PORT + 1}`,
      });
    return;
  }

  console.log("Starting Socket.IO server on port:", PORT + 1);
  const io = new Server({
    path: "/api/socket",
    addTrailingSlash: false,
    cors: { origin: "*" },
  }).listen(PORT + 1);

  io.on("connect", (socket) => {
    const _socket = socket;
    console.log("socket connect", socket.id);
    _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`);
    socket.on("disconnect", async () => {
      console.log("socket disconnect");
    });
  });

  const clients:any = [];
  io.on("connection", (socket) => {
    clients.push(socket.id);
    console.log("A user connected", socket.id);
    // Handle chat messages
    socket.on("chat message", (message) => {
      io.emit("chat message", message); // Broadcast the message to all connected clients
    });

    socket.on("scrapp-completed", () => {
      io.emit("scrap-next");
    });

    socket.on("disconnect", () => {
      console.log(`The client ${socket.id} disconnected`);
      var index = clients.indexOf(socket.id);
      if (index > -1) {
        clients.splice(index, 1);
        console.log(`The socket ${socket.id} is removed`);
      }
    });
  });

  res.socket.server.io = io;
  res
    .status(201)
    .json({
      success: true,
      message: "Socket is started",
      socket: `:${PORT + 1}`,
    });
}
