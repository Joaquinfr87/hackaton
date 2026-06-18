import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MockJwtAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Obtener el primer usuario disponible en base de datos para simular login
    const user = await this.prisma.user.findFirst({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }
}
