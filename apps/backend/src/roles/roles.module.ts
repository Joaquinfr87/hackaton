import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesGuard } from "./roles.guard";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [RolesService, RolesGuard],
  exports: [RolesService, RolesGuard],
})
export class RolesModule {}
