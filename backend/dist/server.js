"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = exports.ApplicationServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import configuration and controllers
const database_1 = __importDefault(require("./config/database"));
exports.DatabaseConfig = database_1.default;
const cors_2 = __importDefault(require("./config/cors"));
const AuthController_1 = require("./controllers/AuthController");
const ServiceController_1 = require("./controllers/ServiceController");
const IncidentController_1 = require("./controllers/IncidentController");
dotenv_1.default.config();
/**
 * Application Server Class
 * Main entry point for the application with OOP principles
 */
class ApplicationServer {
    app;
    server;
    io;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.port = process.env.PORT || 5000;
        // Initialize Socket.io
        this.io = new socket_io_1.Server(this.server, {
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
    getSocketCorsOrigins() {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return [frontendUrl, "localhost", "localhost:5173", "localhost:3000"];
    }
    /**
     * Initialize middleware
     */
    initializeMiddleware() {
        // CORS middleware
        this.app.use((0, cors_1.default)(cors_2.default.getConfig()));
        // Body parsing middleware
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    /**
     * Initialize routes
     */
    initializeRoutes() {
        const prisma = database_1.default.getInstance();
        // Create controllers with dependency injection
        const authController = new AuthController_1.AuthController(prisma);
        const serviceController = new ServiceController_1.ServiceController(prisma, this.io);
        const incidentController = new IncidentController_1.IncidentController(prisma, this.io);
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
    initializeSocketListeners() {
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
    start() {
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
        }
        catch (error) {
            console.error("[Server] Failed to start server:", error);
            process.exit(1);
        }
    }
    /**
     * Setup graceful shutdown
     */
    setupGracefulShutdown() {
        const signals = ["SIGTERM", "SIGINT"];
        signals.forEach((signal) => {
            process.on(signal, async () => {
                console.log(`\n[Server] Received ${signal}, shutting down gracefully...`);
                this.server.close(async () => {
                    console.log("[Server] HTTP server closed");
                    // Disconnect database
                    try {
                        await database_1.default.disconnect();
                        console.log("[Server] Database disconnected");
                    }
                    catch (error) {
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
    getIo() {
        return this.io;
    }
}
exports.ApplicationServer = ApplicationServer;
// Start application
const app = new ApplicationServer();
app.start();
