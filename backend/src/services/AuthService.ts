import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * AuthService
 * Handles user authentication, registration, and token management
 */
export class AuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private bcryptRounds: number = 10;
  private tokenExpiry: string = "1d";

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.jwtSecret = process.env.JWT_SECRET || "fallback-secret";
  }

  /**
   * Login user with email and password
   */
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Register new user
   */
  async register(email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(password, this.bcryptRounds);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string, role: string): string {
    return jwt.sign(
      { id: userId, role },
      this.jwtSecret as string,
      {
        expiresIn: this.tokenExpiry,
      } as any
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { id: string; role: string } {
    try {
      return jwt.verify(token, this.jwtSecret) as {
        id: string;
        role: string;
      };
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
