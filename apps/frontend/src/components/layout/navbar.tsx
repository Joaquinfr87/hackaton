import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menú</span>
      </Button>

      <div className="flex-1">
        <h2 className="text-lg font-semibold text-foreground">
          Sistema de Gestión de Emergencias
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        <Button variant="ghost" className="gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              US
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline-block">
            Usuario
          </span>
        </Button>
      </div>
    </header>
  );
}
