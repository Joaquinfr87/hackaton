import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UsePipes,
} from "@nestjs/common";
import { IncidentsService } from "./incidents.service";
import { CreateIncidentDto, createIncidentSchema } from "./dto/create-incident.dto";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { MockJwtAuthGuard } from "../common/guards/mock-jwt-auth.guard";

@UseGuards(MockJwtAuthGuard) // Guard temporal para simular req.user
@Controller("incidents")
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createIncidentSchema))
  create(@Body() createIncidentDto: CreateIncidentDto, @Request() req: any) {
    return this.incidentsService.create(createIncidentDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.incidentsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.incidentsService.findOne(id);
  }
}
