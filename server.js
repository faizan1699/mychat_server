import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
   
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST"],
  })
);

app.get("/status", (req, res) => {
  res.json({ message: "Server is running" });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST" , "DELETE"],
  },
});

io.on("connection", (socket) => {
  // console.log("New client connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    // console.log(`joined room ${roomId}`);
  });

  socket.on("send_message", (data) => {
    const { reciever, ...message_data } = data;
    console.log("Message received from client:", data);
    io.to(reciever).emit("receive_message", data);
  });

  socket.on("disconnect", () => {});

  socket.on("test_event", (data) => {
    console.log("Received test event data from client:", data);
    socket.emit("test_event_response", {
      response: "Test response from server",
    });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  // console.log(`Server is running on http://localhost:${PORT}`);
});
