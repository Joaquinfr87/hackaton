import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de usuarios del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La gestión de usuarios se implementará próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
