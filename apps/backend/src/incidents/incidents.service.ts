import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import {
  IncidentEventPattern,
  IncidentCreatedEventPayload,
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
}
