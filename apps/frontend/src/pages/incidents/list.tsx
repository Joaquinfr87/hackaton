import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IncidentsListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incidentes</h1>
        <p className="text-sm text-muted-foreground">
          Lista de todos los incidentes reportados
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La tabla de incidentes con filtros y paginación se implementará próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
