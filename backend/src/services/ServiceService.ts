import { PrismaClient, ServiceStatus } from "@prisma/client";
import { Server } from "socket.io";

/**
 * ServiceService
 * Handles all service-related operations
 */
export class ServiceService {
  private prisma: PrismaClient;
  private io: Server;

  constructor(prisma: PrismaClient, io: Server) {
    this.prisma = prisma;
    this.io = io;
  }

  /**
   * Get all services with their latest metrics
   */
  async getAllServices() {
    return await this.prisma.service.findMany({
      include: {
        metrics: {
          orderBy: { recordedAt: "desc" },
          take: 10,
        },
      },
    });
  }

  /**
   * Get a specific service by ID
   */
  async getServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        metrics: {
          orderBy: { recordedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    return service;
  }

  /**
   * Create a new service
   */
  async createService(
    name: string,
    healthCheckUrl: string,
    createdBy: string,
    checkIntervalSeconds?: number
  ) {
    const service = await this.prisma.service.create({
      data: {
        name,
        healthCheckUrl,
        createdBy,
        checkIntervalSeconds: checkIntervalSeconds || 60,
      },
    });

    // Emit event via Socket.io
    this.io.emit("service:new", service);

    return service;
  }

  /**
   * Update service status
   */
  async updateServiceStatus(id: string, status: ServiceStatus) {
    const service = await this.prisma.service.update({
      where: { id },
      data: { status },
    });

    // Emit event via Socket.io
    this.io.emit("service:status_change", service);

    return service;
  }

  /**
   * Delete a service
   */
  async deleteService(id: string) {
    const service = await this.prisma.service.delete({
      where: { id },
    });

    // Emit event via Socket.io
    this.io.emit("service:deleted", service);

    return service;
  }

  /**
   * Record metrics for a service
   */
  async recordMetric(
    serviceId: string,
    cpuUsage: number,
    ramUsage: number,
    responseTimeMs: number,
    statusCode: number
  ) {
    const metric = await this.prisma.serviceMetric.create({
      data: {
        serviceId,
        cpuUsage,
        ramUsage,
        responseTimeMs,
        statusCode,
      },
    });

    // Emit event via Socket.io
    this.io.emit("service:metric_recorded", metric);

    return metric;
  }

  /**
   * Get metrics for a service
   */
  async getServiceMetrics(serviceId: string, limit: number = 50) {
    return await this.prisma.serviceMetric.findMany({
      where: { serviceId },
      orderBy: { recordedAt: "desc" },
      take: limit,
    });
  }
}
