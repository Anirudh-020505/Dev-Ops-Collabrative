/**
 * CORS Configuration
 * Centralized CORS settings
 */
class CorsConfig {
  static getConfig() {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const allowedOrigins = [
      frontendUrl,
      "localhost",
      "localhost:5173",
      "localhost:3000",
    ];

    return {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };
  }
}

export default CorsConfig;
