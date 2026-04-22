import { Router, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { PrismaClient } from "@prisma/client";

/**
 * AuthController
 * Handles HTTP requests for authentication
 */
export class AuthController {
  private router: Router;
  private authService: AuthService;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.authService = new AuthService(prisma);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/login", this.login.bind(this));
    this.router.post("/register", this.register.bind(this));
  }

  private async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res
        .status(error instanceof Error && error.message === "Invalid credentials" ? 401 : 500)
        .json({ error: message });
    }
  }

  private async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const result = await this.authService.register(email, password);
      res.status(201).json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(400).json({ error: message });
    }
  }

  getRouter(): Router {
    return this.router;
  }
}
