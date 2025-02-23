const express = require("express");
const next = require("next");
const { createServer } = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// In-memory storage for messages (each message will include a room field)
const messages = [];

app.prepare().then(() => {
  const expressApp = express();

  // Apply JSON middleware only for /api/messages routes
  expressApp.use("/api/messages", express.json());

  const httpServer = createServer(expressApp);

  // GET endpoint to retrieve messages for a specific room
  expressApp.get("/api/messages", (req, res) => {
    const room = req.query.room;
    if (room) {
      const filteredMessages = messages.filter((msg) => msg.room === room);
      res.json(filteredMessages);
    } else {
      res.status(400).json({ error: "Room parameter is required" });
    }
  });

  // POST endpoint to save a new message for a specific room
  expressApp.post("/api/messages", (req, res) => {
    const room = req.query.room;
    if (!room) {
      return res.status(400).json({ error: "Room parameter is required" });
    }
    const { text, sender, contactId, time } = req.body;
    if (!text || !sender) {
      return res.status(400).json({ error: "Invalid message payload" });
    }
    const newMsg = {
      sender,
      text,
      time: time || new Date().toLocaleTimeString(),
      room,
      contactId,
    };
    messages.push(newMsg);
    res.status(201).json(newMsg);
  });

  // Initialize Socket.io and attach it to the HTTP server.
  const io = new Server(httpServer, {
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    // Extract role, room, and (optionally) contactId from the handshake query.
    const { role, room, contactId } = socket.handshake.query;
    if (room) {
      socket.join(room);
      socket.data.room = room;
      // If the connecting client is a "client", store its contactId
      if (role === "client" && contactId) {
        socket.data.contactId = contactId;
      }
      console.log(`${role} connected to room ${room}`);
    } else {
      console.warn("No room specified in connection");
    }

    socket.on("clientMessage", (data) => {
      const currentRoom = socket.data.room;
      const clientMsg = {
        sender: "client",
        text: data.text,
        time: new Date().toLocaleTimeString(),
        room: currentRoom,
        contactId: data.contactId,
      };
      messages.push(clientMsg);
      if (currentRoom) {
        io.to(currentRoom).emit("clientMessage", clientMsg);
      }
    });

    socket.on("staffMessage", (data) => {
      const currentRoom = socket.data.room;
      const staffMsg = {
        sender: "staff",
        text: data.text,
        time: new Date().toLocaleTimeString(),
        room: currentRoom,
        contactId: data.contactId, // target contactId provided by the staff dashboard
      };
      messages.push(staffMsg);
      if (currentRoom && data.contactId) {
        // Instead of broadcasting to everyone in the room, send only to the client with the matching contactId.
        const clients = io.sockets.adapter.rooms.get(currentRoom);
        if (clients) {
          for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);
            if (
              clientSocket &&
              clientSocket.handshake.query.role === "client" &&
              clientSocket.handshake.query.contactId === data.contactId
            ) {
              clientSocket.emit("staffMessage", staffMsg);
            }
          }
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });

  // Let Next.js handle all other requests.
  expressApp.all("*", (req, res) => handle(req, res));

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
