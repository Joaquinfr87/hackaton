import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";

const stats = [
  {
    title: "Incidentes Activos",
    value: "12",
    icon: AlertTriangle,
    variant: "destructive" as const,
  },
  {
    title: "En Progreso",
    value: "5",
    icon: Clock,
    variant: "default" as const,
  },
  {
    title: "Resueltos",
    value: "48",
    icon: CheckCircle2,
    variant: "default" as const,
  },
  {
    title: "Usuarios",
    value: "24",
    icon: Users,
    variant: "default" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general del sistema de emergencias
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Incidentes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No hay incidentes recientes para mostrar.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Los datos de distribución se mostrarán aquí.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
