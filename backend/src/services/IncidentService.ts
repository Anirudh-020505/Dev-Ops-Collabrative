import { PrismaClient, IncidentStatus, Severity } from "@prisma/client";
import { Server } from "socket.io";

/**
 * IncidentService
 * Handles all incident-related operations
 */
export class IncidentService {
  private prisma: PrismaClient;
  private io: Server;

  constructor(prisma: PrismaClient, io: Server) {
    this.prisma = prisma;
    this.io = io;
  }

  /**
   * Get all incidents with related data
   */
  async getAllIncidents() {
    return await this.prisma.incident.findMany({
      include: {
        service: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get a specific incident by ID
   */
  async getIncidentById(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: {
        service: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!incident) {
      throw new Error("Incident not found");
    }

    return incident;
  }

  /**
   * Create a new incident
   */
  async createIncident(
    serviceId: string,
    title: string,
    description: string,
    severity: Severity
  ) {
    const incident = await this.prisma.incident.create({
      data: {
        serviceId,
        title,
        description,
        severity,
      },
      include: {
        service: true,
      },
    });

    // Emit event via Socket.io
    this.io.emit("incident:new", incident);

    return incident;
  }

  /**
   * Update incident status
   */
  async updateIncidentStatus(id: string, status: IncidentStatus) {
    const data: any = { status };

    // Set resolvedAt timestamp if resolving incident
    if (status === "RESOLVED") {
      data.resolvedAt = new Date();
    }

    const incident = await this.prisma.incident.update({
      where: { id },
      data,
      include: {
        service: true,
      },
    });

    // Emit event via Socket.io
    this.io.emit("incident:status_change", incident);

    return incident;
  }

  /**
   * Add comment to incident
   */
  async addComment(incidentId: string, userId: string, message: string) {
    const comment = await this.prisma.incidentComment.create({
      data: {
        incidentId,
        userId,
        message,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Emit event via Socket.io
    this.io.emit("incident:comment", comment);

    return comment;
  }

  /**
   * Get comments for an incident
   */
  async getIncidentComments(incidentId: string) {
    return await this.prisma.incidentComment.findMany({
      where: { incidentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Get incidents by service
   */
  async getIncidentsByService(serviceId: string) {
    return await this.prisma.incident.findMany({
      where: { serviceId },
      include: {
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
