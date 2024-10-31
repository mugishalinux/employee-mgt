import { BullModule } from "@nestjs/bull";
import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { EventHelper } from "src/helpers/events.helper";
import { HelperModule } from "src/helpers/helper.module";
import { ResponseService } from "src/response/response.service";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    HelperModule,
    ResponseService,
    BullModule.registerQueue({
      name: process.env.QUEUE_NAME,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, ResponseService, EventHelper],
  exports: [UserService],
})
export class UserModule {}
