import { Router, Request, Response } from "express";
import { ServiceService } from "../services/ServiceService";
import { PrismaClient, ServiceStatus } from "@prisma/client";
import { Server } from "socket.io";

/**
 * ServiceController
 * Handles HTTP requests for service management
 */
export class ServiceController {
  private router: Router;
  private serviceService: ServiceService;

  constructor(prisma: PrismaClient, io: Server) {
    this.router = Router();
    this.serviceService = new ServiceService(prisma, io);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.getAllServices.bind(this));
    this.router.get("/:id", this.getServiceById.bind(this));
    this.router.post("/", this.createService.bind(this));
    this.router.put("/:id", this.updateServiceStatus.bind(this));
    this.router.delete("/:id", this.deleteService.bind(this));
    this.router.post("/:id/metrics", this.recordMetric.bind(this));
    this.router.get("/:id/metrics", this.getMetrics.bind(this));
  }

  private async getAllServices(req: Request, res: Response): Promise<void> {
    try {
      const services = await this.serviceService.getAllServices();
      res.json(services);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async getServiceById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const service = await this.serviceService.getServiceById(id);
      res.json(service);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res
        .status(
          error instanceof Error && error.message === "Service not found"
            ? 404
            : 500
        )
        .json({ error: message });
    }
  }

  private async createService(req: Request, res: Response): Promise<void> {
    try {
      const { name, healthCheckUrl, checkIntervalSeconds } = req.body;

      if (!name || !healthCheckUrl) {
        res.status(400).json({ error: "Name and healthCheckUrl are required" });
        return;
      }

      const createdBy = (req as any).userId || "SYSTEM";
      const service = await this.serviceService.createService(
        name,
        healthCheckUrl,
        createdBy,
        checkIntervalSeconds
      );

      res.status(201).json(service);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async updateServiceStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!status || !Object.values(ServiceStatus).includes(status)) {
        res.status(400).json({ error: "Valid status is required" });
        return;
      }

      const service = await this.serviceService.updateServiceStatus(
        id,
        status
      );
      res.json(service);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const service = await this.serviceService.deleteService(id);
      res.json({ message: "Service deleted successfully", service });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async recordMetric(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { cpuUsage, ramUsage, responseTimeMs, statusCode } = req.body;

      if (
        cpuUsage === undefined ||
        ramUsage === undefined ||
        responseTimeMs === undefined ||
        statusCode === undefined
      ) {
        res
          .status(400)
          .json(
            { error: "cpuUsage, ramUsage, responseTimeMs, and statusCode are required" }
          );
        return;
      }

      const metric = await this.serviceService.recordMetric(
        id,
        cpuUsage,
        ramUsage,
        responseTimeMs,
        statusCode
      );

      res.status(201).json(metric);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const metrics = await this.serviceService.getServiceMetrics(id, limit);
      res.json(metrics);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  getRouter(): Router {
    return this.router;
  }
}
