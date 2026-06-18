import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import { RegisterSchema, RegisterDto } from "./dto/register.dto";
import { LoginSchema, LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() body: RegisterDto) {
    const data = RegisterSchema.parse(body);
    return this.authService.register(data);
  }

  @Public()
  @Post("login")
  login(@Body() body: LoginDto) {
    const data = LoginSchema.parse(body);
    return this.authService.login(data);
  }

  @Get("me")
  me(@CurrentUser() user: { id: string; email: string; name: string; roles: string[] }) {
    return user;
  }
}
