import { UserService } from "../service/user.service";
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  ConsoleLogger,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { RegisterDto } from "../dto/register.dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../entity/user.entity";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LoginOtpDto } from "../dto/login-otp.dto";
import { PasswordResetOtpDto } from "../dto/password-reset-otp.dto";
import { Roles } from "../model/role.model";
import { AuthService } from "src/auth/auth.service";
import { EventHelper } from "src/helpers/events.helper";
import { LoginDto } from "../dto/login.dto";
import { CustomAuthGuard } from "src/auth/custom.guard";
import { PasswordChangeConfirmOptDto } from "../dto/password-reset-confirm-opt.dto";
import { RedisHelper } from "src/helpers/redis-helper";
import { RolesGuard } from "src/auth/roles.guard";
import { HasRoles } from "src/auth/has-roles.decorator";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const otpGenerator = require("otp-generator");

@ApiTags("user module end-points")
@Controller({ version: "1", path: "/users" })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly redisHelper: RedisHelper,
    private readonly eventHelper: EventHelper,
  ) {}

  @Post("/register")
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.registerUser(registerDto);
  }

  @Post("/request-login-otp")
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post("/confirm-login-otp")
  async confirmOTP(@Body() loginOtpDto: LoginOtpDto) {
    const user = await this.userService.validateOtpMessage(loginOtpDto);
    return this.authService.login(user);
  }

  @Post("/forget-password-request-otp/:username")
  async passwordResetOtpRequest(@Param("username") username: string) {
    return this.userService.forgetPasswordRequestOtp(username);
  }
  @Post("/confirm-password-reset-otp")
  async changePasswordByValidateOtp(
    @Body() passwordResetConfirmOptDto: PasswordChangeConfirmOptDto,
  ) {
    return this.userService.changePasswordByValidateOtp(
      passwordResetConfirmOptDto,
    );
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Post("/password-reset-request-otp/")
  async passwordChangeRequestOtp(@Request() req) {
    const token = req.headers.authorization.split(" ")[1];
    const user = req.user;
    return this.userService.forgetPasswordRequestOtp(user.username);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Post("/verify-password-reset-otp")
  async passwordResetOtpConfirm(
    @Request() req,
    @Body() passwordResetConfirmOptDto: PasswordChangeConfirmOptDto,
  ) {
    return this.userService.resettingPassword(req, passwordResetConfirmOptDto);
  }

  @ApiBearerAuth()
  @Post("/logout")
  logout(@Request() req) {
    return this.authService.logout(req.headers["authorization"].split(" ")[1]);
  }
  @ApiBearerAuth()
  @Get("/getMessage")
  @UseGuards(CustomAuthGuard)
  getMessage(@Request() req) {
    return "Hello it works";
  }
}
