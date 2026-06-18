import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PrismaService } from "../prisma/prisma.service";
import {
  IncidentEventPattern,
  IncidentCreatedEventPayload,
  IncidentStatusChangedEventPayload,
} from "../incidents/events/incident.events";

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  @OnEvent(IncidentEventPattern.CREATED)
  async handleIncidentCreated(payload: IncidentCreatedEventPayload) {
    try {
      await this.prisma.auditLog.create({
        data: {
          incidentId: payload.incidentId,
          userId: payload.userId,
          action: "CREATED",
          newStatus: "reported",
          comment: "Incidente reportado inicialmente",
        },
      });
      this.logger.log(`Auditoría registrada: incidente creado (${payload.incidentId})`);
    } catch (error) {
      this.logger.error(
        `Error al registrar auditoría de creación de incidente ${payload.incidentId}:`,
        error instanceof Error ? error.stack : error,
      );
    }
  }

  @OnEvent(IncidentEventPattern.STATUS_CHANGED)
  async handleIncidentStatusChanged(payload: IncidentStatusChangedEventPayload) {
    try {
      await this.prisma.auditLog.create({
        data: {
          incidentId: payload.incidentId,
          userId: payload.userId,
          action: "STATUS_CHANGE",
          oldStatus: payload.oldStatus,
          newStatus: payload.newStatus,
          comment: payload.comment || "Cambio de estado del incidente",
        },
      });
      this.logger.log(
        `Auditoría registrada: cambio de estado del incidente (${payload.incidentId}): ${payload.oldStatus} -> ${payload.newStatus}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al registrar auditoría de cambio de estado de incidente ${payload.incidentId}:`,
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
