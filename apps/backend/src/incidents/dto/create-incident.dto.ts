import { z } from "zod";

export const createIncidentSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "Describe el incidente con más detalle"),
  type: z.string().min(2, "Especifica el tipo de incidente"),
  severity: z.string().min(2, "Especifica la severidad"),
  location: z.string().min(3, "La ubicación es requerida"),
  areaId: z.string().uuid().optional(),
});

export type CreateIncidentDto = z.infer<typeof createIncidentSchema>;
