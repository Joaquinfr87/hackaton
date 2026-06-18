import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Registrarse</CardTitle>
          <CardDescription>
            Cree una cuenta para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            El formulario de registro se implementará próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
