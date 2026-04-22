import { Router, Request, Response } from "express";
import { IncidentService } from "../services/IncidentService";
import { PrismaClient, IncidentStatus, Severity } from "@prisma/client";
import { Server } from "socket.io";

/**
 * IncidentController
 * Handles HTTP requests for incident management
 */
export class IncidentController {
  private router: Router;
  private incidentService: IncidentService;

  constructor(prisma: PrismaClient, io: Server) {
    this.router = Router();
    this.incidentService = new IncidentService(prisma, io);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.getAllIncidents.bind(this));
    this.router.get("/:id", this.getIncidentById.bind(this));
    this.router.post("/", this.createIncident.bind(this));
    this.router.put("/:id", this.updateIncidentStatus.bind(this));
    this.router.post("/:id/comments", this.addComment.bind(this));
    this.router.get("/:id/comments", this.getComments.bind(this));
    this.router.get("/service/:serviceId", this.getIncidentsByService.bind(this));
  }

  private async getAllIncidents(req: Request, res: Response): Promise<void> {
    try {
      const incidents = await this.incidentService.getAllIncidents();
      res.json(incidents);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async getIncidentById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const incident = await this.incidentService.getIncidentById(id);
      res.json(incident);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res
        .status(
          error instanceof Error && error.message === "Incident not found"
            ? 404
            : 500
        )
        .json({ error: message });
    }
  }

  private async createIncident(req: Request, res: Response): Promise<void> {
    try {
      const { serviceId, title, description, severity } = req.body;

      if (!serviceId || !title || !description || !severity) {
        res.status(400).json({
          error:
            "serviceId, title, description, and severity are required",
        });
        return;
      }

      if (!Object.values(Severity).includes(severity)) {
        res.status(400).json({
          error: `Invalid severity. Must be one of: ${Object.values(Severity).join(", ")}`,
        });
        return;
      }

      const incident = await this.incidentService.createIncident(
        serviceId,
        title,
        description,
        severity
      );

      res.status(201).json(incident);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async updateIncidentStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!status || !Object.values(IncidentStatus).includes(status)) {
        res.status(400).json({
          error: `Valid status is required. Must be one of: ${Object.values(IncidentStatus).join(", ")}`,
        });
        return;
      }

      const incident = await this.incidentService.updateIncidentStatus(
        id,
        status
      );
      res.json(incident);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async addComment(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { message } = req.body;
      const userId = (req as any).userId || "SYSTEM";

      if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      const comment = await this.incidentService.addComment(
        id,
        userId,
        message
      );
      res.status(201).json(comment);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async getComments(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const comments = await this.incidentService.getIncidentComments(id);
      res.json(comments);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  }

  private async getIncidentsByService(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const serviceId = req.params.serviceId as string;
      const incidents = await this.incidentService.getIncidentsByService(
        serviceId
      );
      res.json(incidents);
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
