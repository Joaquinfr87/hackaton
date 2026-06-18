import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { Edit2, Trash2, Eye, Plus, Loader2, AlertCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  status: string;
  location: string;
  createdAt: string;
  reportedBy?: {
    name: string;
    email: string;
  };
}

const updateFormSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "Describe el incidente con más detalle"),
  type: z.string().min(2, "Especifica el tipo de incidente"),
  severity: z.string().min(2, "Especifica la severidad"),
  status: z.string().min(2, "Especifica el estado"),
  location: z.string().min(3, "La ubicación es requerida"),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

const INCIDENT_TYPE_OPTIONS = [
  { value: "fire", label: "Incendio" },
  { value: "power_outage", label: "Corte de Energía" },
  { value: "accident", label: "Accidente" },
  { value: "flood", label: "Inundación" },
  { value: "security", label: "Seguridad" },
  { value: "other", label: "Otro" },
];

const SEVERITY_OPTIONS = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
];

const STATUS_OPTIONS = [
  { value: "reported", label: "Reportado" },
  { value: "assigned", label: "Asignado" },
  { value: "in_progress", label: "En Progreso" },
  { value: "resolved", label: "Resuelto" },
  { value: "closed", label: "Cerrado" },
];

export default function IncidentsListPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);

  const { data: incidents, isLoading, error } = useQuery<Incident[]>({
    queryKey: ["incidents"],
    queryFn: () => api<Incident[]>("/incidents"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/incidents/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFormValues }) =>
      api(`/incidents/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      setEditingIncident(null);
    },
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
  });

  const handleEditClick = (incident: Incident) => {
    setEditingIncident(incident);
    reset({
      title: incident.title,
      description: incident.description,
      type: incident.type,
      severity: incident.severity,
      status: incident.status,
      location: incident.location,
    });
  };

  const onSubmit = (values: UpdateFormValues) => {
    if (editingIncident) {
      updateMutation.mutate({ id: editingIncident.id, data: values });
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge variant="secondary">Baja</Badge>;
      case "medium":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-transparent">Media</Badge>;
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-transparent">Alta</Badge>;
      case "critical":
        return <Badge variant="destructive">Crítica</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-transparent">Reportado</Badge>;
      case "assigned":
        return <Badge className="bg-sky-500 hover:bg-sky-600 text-white border-transparent">Asignado</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-transparent">En Progreso</Badge>;
      case "resolved":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent">Resuelto</Badge>;
      case "closed":
        return <Badge variant="outline">Cerrado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidentes</h1>
          <p className="text-sm text-muted-foreground">
            Lista y gestión de todos los incidentes reportados
          </p>
        </div>
        <Button onClick={() => navigate("/incidents/report")} className="gap-2">
          <Plus className="h-4 w-4" /> Reportar Incidente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Cargando incidentes...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Ocurrió un error al cargar la lista de incidentes.</span>
            </div>
          ) : !incidents || incidents.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm text-muted-foreground">No se encontraron incidentes registrados.</p>
              <Button variant="outline" size="sm" onClick={() => navigate("/incidents/report")}>
                Reportar el primero
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.title}</TableCell>
                    <TableCell className="capitalize">{incident.type}</TableCell>
                    <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                    <TableCell>{getStatusBadge(incident.status)}</TableCell>
                    <TableCell>{incident.location}</TableCell>
                    <TableCell>
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/incidents/${incident.id}`)}
                          title="Ver Detalle"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(incident)}
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("¿Está seguro de eliminar este incidente?")) {
                              deleteMutation.mutate(incident.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de edición */}
      <Dialog open={editingIncident !== null} onOpenChange={(open) => !open && setEditingIncident(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Incidente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título del incidente</Label>
              <Input id="edit-title" {...register("title")} />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <textarea
                id="edit-description"
                rows={3}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {INCIDENT_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Severidad</Label>
                <Controller
                  name="severity"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione severidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEVERITY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Ubicación</Label>
              <Input id="edit-location" {...register("location")} />
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location.message}</p>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingIncident(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
