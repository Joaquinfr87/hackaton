import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

function App() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">
        Sistema de Gestión de Emergencias
      </h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Botones</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Input</h2>
        <Input placeholder="Escribe algo..." className="max-w-sm" />
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Incidente Reciente</CardTitle>
          <CardDescription>Último reporte registrado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Fuga de agua en el edificio principal
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tabla</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>001</TableCell>
              <TableCell>Fuga de agua</TableCell>
              <TableCell>Reportado</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>002</TableCell>
              <TableCell>Corte de luz</TableCell>
              <TableCell>En proceso</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Abrir Diálogo
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del Incidente</DialogTitle>
            <DialogDescription>
              Información completa del incidente seleccionado.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Acá se mostrarán los detalles del incidente.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
