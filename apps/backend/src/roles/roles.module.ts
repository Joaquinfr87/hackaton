import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RolesService } from "./roles.service";
import { RolesGuard } from "./roles.guard";

@Module({
  providers: [
    RolesService,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [RolesService],
})
export class RolesModule {}
