import { z } from "zod";

export const IncidentType = z.enum([
  "fire",
  "power_outage",
  "accident",
  "flood",
  "security",
  "other",
]);

export const IncidentSeverity = z.enum([
  "low",
  "medium",
  "high",
  "critical",
]);

export const IncidentStatus = z.enum([
  "reported",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
]);

export const CreateIncidentSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  type: IncidentType,
  severity: IncidentSeverity,
  location: z.string().min(1, "La ubicación es requerida"),
  reportedBy: z.string().min(1),
});

export const UpdateIncidentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: IncidentType.optional(),
  severity: IncidentSeverity.optional(),
  status: IncidentStatus.optional(),
  location: z.string().min(1).optional(),
  assignedTo: z.string().nullable().optional(),
});

export type CreateIncidentDto = z.infer<typeof CreateIncidentSchema>;
export type UpdateIncidentDto = z.infer<typeof UpdateIncidentSchema>;
export type Incident = z.infer<typeof CreateIncidentSchema> & {
  id: string;
  status: z.infer<typeof IncidentStatus>;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string | null;
};
