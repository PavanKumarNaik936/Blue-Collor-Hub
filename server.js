// server.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env.local") });
console.log("MONGO_URI:", process.env.MONGO_URI); // should print your Mongo URI

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare Next.js app
app.prepare().then(async () => {
  // Dynamically import modules that depend on process.env
  const { default: connect } = await import("./lib/mongodb.js");
  const { default: Conversation } = await import("./models/Conversation.js");
  const { default: Message } = await import("./models/Message.js");

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a room for the user ID
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      const { sender, receiver, text } = data;

      // Connect to MongoDB
      await connect();

      // Find or create 1-on-1 conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver], $size: 2 }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [sender, receiver]
        });
      }

      // Save message
      const message = await Message.create({
        conversationId: conversation._id,
        sender,
        text
      });

      // Update last message
      conversation.lastMessage = text;
      conversation.updatedAt = new Date();
      await conversation.save();

      // Emit message to sender and receiver only
      [sender, receiver].forEach((user) => {
        io.to(user).emit("receiveMessage", message);
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
