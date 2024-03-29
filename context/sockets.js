import { createContext } from "react";
import io from "socket.io-client";

const s = io("https://websockets-server-production-e01b.up.railway.app"); // Replace with your server URL
export const socket = s;
export const SocketContext = createContext();

//import { PORT } from "@/config/app"
//import { Socket, io } from "socket.io-client"
//const PORT = 3301
//export default function socketClient() {
//  const socket = io(`:${PORT + 1}`, { path: "/api/socket", addTrailingSlash: false })
//
//  socket.on("connect", () => {
//    console.log("Connected")
//  })
//
//  socket.on("disconnect", () => {
//    console.log("Disconnected")
//  })
//
//  socket.on("connect_error", async err => {
//    console.log(`connect_error due to ${err.message}`)
//    await fetch("/api/socket")
//  })
//
//  return socket
//}
