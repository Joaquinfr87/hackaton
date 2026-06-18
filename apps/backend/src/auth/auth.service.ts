import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException("El email ya está registrado");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const role = await this.prisma.role.findUnique({
      where: { name: "user" },
    });

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        roles: role
          ? { create: { roleId: role.id } }
          : undefined,
      },
      include: { roles: { include: { role: true } } },
    });

    return this.buildResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    return this.buildResponse(user);
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Usuario no encontrado o inactivo");
    }

    return user;
  }

  private buildResponse(
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      isActive: boolean;
      roles: { role: { name: string } }[];
    },
  ) {
    const roles = user.roles.map((ur) => ur.role.name);
    const payload = { sub: user.id, email: user.email, roles };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles,
      },
    };
  }
}
