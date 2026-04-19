import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Get frontend URL from environment or default
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = [
  frontendUrl,
  "localhost",
  "localhost:5173",
  "localhost:3000",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from "./routes/auth";
import serviceRoutes from "./routes/services";
import incidentRoutes from "./routes/incidents";

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/incidents", incidentRoutes);

app.get("/health", (req, res) => res.json({ status: "UP" }));

// Socket.io
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

export { io };

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
