import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IncidentDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Detalle del Incidente</h1>
        <p className="text-sm text-muted-foreground">
          Información completa del incidente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Incidente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            El detalle del incidente se implementará próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
