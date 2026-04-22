import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

// Import configuration and controllers
import DatabaseConfig from "./config/database";
import CorsConfig from "./config/cors";
import { AuthController } from "./controllers/AuthController";
import { ServiceController } from "./controllers/ServiceController";
import { IncidentController } from "./controllers/IncidentController";

dotenv.config();

/**
 * Application Server Class
 * Main entry point for the application with OOP principles
 */
class ApplicationServer {
  private app: express.Application;
  private server: http.Server;
  private io: Server;
  private port: number | string;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = process.env.PORT || 5000;

    // Initialize Socket.io
    this.io = new Server(this.server, {
      cors: {
        origin: this.getSocketCorsOrigins(),
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
    });
  }

  /**
   * Get CORS origins for Socket.io
   */
  private getSocketCorsOrigins(): string[] {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return [frontendUrl, "localhost", "localhost:5173", "localhost:3000"];
  }

  /**
   * Initialize middleware
   */
  private initializeMiddleware(): void {
    // CORS middleware
    this.app.use(cors(CorsConfig.getConfig()));

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Initialize routes
   */
  private initializeRoutes(): void {
    const prisma = DatabaseConfig.getInstance();

    // Create controllers with dependency injection
    const authController = new AuthController(prisma);
    const serviceController = new ServiceController(prisma, this.io);
    const incidentController = new IncidentController(prisma, this.io);

    // Register routes
    this.app.use("/api/auth", authController.getRouter());
    this.app.use("/api/services", serviceController.getRouter());
    this.app.use("/api/incidents", incidentController.getRouter());

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.json({ status: "UP", timestamp: new Date().toISOString() });
    });
  }

  /**
   * Initialize Socket.io listeners
   */
  private initializeSocketListeners(): void {
    this.io.on("connection", (socket) => {
      console.log(`[Socket.io] Client connected: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`[Socket.io] Client disconnected: ${socket.id}`);
      });

      socket.on("error", (error) => {
        console.error(`[Socket.io] Error from ${socket.id}:`, error);
      });
    });
  }

  /**
   * Start the server
   */
  public start(): void {
    try {
      this.initializeMiddleware();
      this.initializeRoutes();
      this.initializeSocketListeners();

      this.server.listen(this.port, () => {
        console.log(`[Server] Listening on port ${this.port}`);
        console.log(`[Server] Environment: ${process.env.NODE_ENV || "development"}`);
      });

      // Graceful shutdown
      this.setupGracefulShutdown();
    } catch (error) {
      console.error("[Server] Failed to start server:", error);
      process.exit(1);
    }
  }

  /**
   * Setup graceful shutdown
   */
  private setupGracefulShutdown(): void {
    const signals = ["SIGTERM", "SIGINT"];

    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\n[Server] Received ${signal}, shutting down gracefully...`);

        this.server.close(async () => {
          console.log("[Server] HTTP server closed");

          // Disconnect database
          try {
            await DatabaseConfig.disconnect();
            console.log("[Server] Database disconnected");
          } catch (error) {
            console.error("[Server] Error disconnecting database:", error);
          }

          process.exit(0);
        });
      });
    });
  }

  /**
   * Export Socket.io instance for external use
   */
  public getIo(): Server {
    return this.io;
  }
}

// Start application
const app = new ApplicationServer();
app.start();

// Export for testing purposes
export { ApplicationServer, DatabaseConfig };
