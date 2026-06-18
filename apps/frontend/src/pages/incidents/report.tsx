import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportIncidentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reportar Incidente</h1>
        <p className="text-sm text-muted-foreground">
          Reporte un nuevo incidente de emergencia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulario de Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            El formulario de reporte de incidentes se implementará próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
