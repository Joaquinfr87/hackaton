import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { RegisterSchema, RegisterDto } from "./dto/register.dto";
import { LoginSchema, LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() body: RegisterDto) {
    const data = RegisterSchema.parse(body);
    return this.authService.register(data);
  }

  @Post("login")
  login(@Body() body: LoginDto) {
    const data = LoginSchema.parse(body);
    return this.authService.login(data);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { id: string; email: string; name: string; roles: string[] }) {
    return user;
  }
}
