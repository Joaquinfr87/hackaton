import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY, Role } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Si no hay roles requeridos, la ruta es pública o solo requiere estar logueado
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false; // Si no hay usuario en el request, denegar acceso
    }

    // Extraer los nombres de los roles del usuario de forma robusta
    const userRoles: string[] = [];
    if (Array.isArray(user.roles)) {
      user.roles.forEach((r: any) => {
        if (typeof r === "string") {
          userRoles.push(r);
        } else if (r && typeof r === "object") {
          // Si es el objeto de relación de Prisma UserRole -> Role
          if (r.role && typeof r.role.name === "string") {
            userRoles.push(r.role.name);
          } else if (typeof r.name === "string") {
            userRoles.push(r.name);
          }
        }
      });
    }

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
