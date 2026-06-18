import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import {
  IncidentEventPattern,
  IncidentCreatedEventPayload,
  IncidentStatusChangedEventPayload,
} from "./events/incident.events";

@Injectable()
export class IncidentsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createIncidentDto: CreateIncidentDto, userId: string) {
    const incident = await this.prisma.incident.create({
      data: {
        title: createIncidentDto.title,
        description: createIncidentDto.description,
        type: createIncidentDto.type,
        severity: createIncidentDto.severity,
        location: createIncidentDto.location,
        areaId: createIncidentDto.areaId || null,
        reportedById: userId,
      },
    });

    // Emitir el evento de auditoría tipado
    this.eventEmitter.emit(IncidentEventPattern.CREATED, {
      incidentId: incident.id,
      userId: userId,
    } satisfies IncidentCreatedEventPayload);

    return incident;
  }

  async findAll() {
    return this.prisma.incident.findMany({
      include: {
        reportedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        area: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: {
        reportedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        area: true,
        auditLogs: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!incident) {
      throw new NotFoundException(`El incidente con ID ${id} no existe`);
    }

    return incident;
  }

  async update(id: string, updateIncidentDto: any, userId: string) {
    const existing = await this.findOne(id);
    const updated = await this.prisma.incident.update({
      where: { id },
      data: {
        title: updateIncidentDto.title,
        description: updateIncidentDto.description,
        type: updateIncidentDto.type,
        severity: updateIncidentDto.severity,
        location: updateIncidentDto.location,
        status: updateIncidentDto.status,
        assignedToId: updateIncidentDto.assignedToId || null,
        areaId: updateIncidentDto.areaId || null,
      },
    });

    if (updateIncidentDto.status && updateIncidentDto.status !== existing.status) {
      this.eventEmitter.emit(IncidentEventPattern.STATUS_CHANGED, {
        incidentId: id,
        userId: userId,
        oldStatus: existing.status,
        newStatus: updateIncidentDto.status,
        comment: "Estado modificado por el usuario",
      } satisfies IncidentStatusChangedEventPayload);
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.incident.delete({
      where: { id },
    });
  }
}

