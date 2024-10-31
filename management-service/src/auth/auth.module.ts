import { forwardRef, Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/user.module";
import { UserService } from "src/users/service/user.service";
import { DeleteExpiredTokens } from "src/users/worker/job.service";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { LocaleStrategy } from "./local.strategy";

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "60000s" },
    }),
  ],
  providers: [AuthService, LocaleStrategy, JwtStrategy, DeleteExpiredTokens],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
