const express = require("express");
const next = require("next");
const { createServer } = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 3001;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// In-memory storage for messages
const messages = [];

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = createServer(expressApp);

  // API endpoint to retrieve all messages
  expressApp.get("/api/messages", (req, res) => {
    res.json(messages);
  });

  // Initialize Socket.io and attach it to the HTTP server.
  const io = new Server(httpServer, {
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log("Client connected via Socket.io");

    // Listen for messages from the client.
    socket.on("clientMessage", (data) => {
      console.log("Received client message:", data);

      // Save the client message
      const clientMsg = {
        sender: "client",
        text: data.text,
        time: new Date().toLocaleTimeString(),
      };
      messages.push(clientMsg);

      // For demonstration, echo the message back as a staff response.
      const serverMsg = {
        sender: "staff",
        text: `Echo: ${data.text}`,
        time: new Date().toLocaleTimeString(),
      };
      messages.push(serverMsg);

      // Emit the server message back to the client.
      socket.emit("serverMessage", serverMsg);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Let Next.js handle all other requests.
  expressApp.all("*", (req, res) => handle(req, res));

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
