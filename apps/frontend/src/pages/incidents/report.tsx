import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { AlertTriangle, Loader2 } from "lucide-react";

const reportFormSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "Describe el incidente con más detalle (mínimo 10 caracteres)"),
  type: z.enum(
    ["fire", "power_outage", "accident", "flood", "security", "other"],
    { required_error: "Seleccione un tipo de incidente" },
  ),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Seleccione una severidad",
  }),
  location: z.string().min(3, "La ubicación debe tener al menos 3 caracteres"),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const INCIDENT_TYPE_OPTIONS = [
  { value: "fire", label: "Incendio" },
  { value: "power_outage", label: "Corte de Energía" },
  { value: "accident", label: "Accidente" },
  { value: "flood", label: "Inundación" },
  { value: "security", label: "Seguridad" },
  { value: "other", label: "Otro" },
] as const;

const SEVERITY_OPTIONS = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
] as const;

export default function ReportIncidentPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ReportFormValues) =>
      api("/incidents", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      navigate("/incidents");
    },
    onError: (err) => {
      setError(
        err instanceof Error ? err.message : "Error al reportar el incidente",
      );
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    setError(null);
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Reportar Incidente
        </h1>
        <p className="text-sm text-muted-foreground">
          Reporte un nuevo incidente de emergencia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulario de Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Título del incidente</Label>
              <Input
                id="title"
                placeholder="Ej: Incendio en edificio A"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describa detalladamente lo sucedido..."
                className="h-20 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 resize-y"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de incidente</Label>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
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
                {form.formState.errors.type && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Severidad</Label>
                <Controller
                  name="severity"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
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
                {form.formState.errors.severity && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.severity.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                placeholder="Ej: Edificio A, piso 3, sala 301"
                {...form.register("location")}
              />
              {form.formState.errors.location && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reportando...
                </>
              ) : (
                "Reportar Incidente"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
