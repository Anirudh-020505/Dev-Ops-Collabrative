import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Database Configuration
 * Handles Prisma initialization and exports a singleton instance
 */
class DatabaseConfig {
  private static instance: PrismaClient | null = null;

  static getInstance(): PrismaClient {
    if (!DatabaseConfig.instance) {
      const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
      });
      DatabaseConfig.instance = new PrismaClient({ adapter });
    }
    return DatabaseConfig.instance;
  }

  static async disconnect(): Promise<void> {
    if (DatabaseConfig.instance) {
      await DatabaseConfig.instance.$disconnect();
      DatabaseConfig.instance = null;
    }
  }
}

export default DatabaseConfig;
