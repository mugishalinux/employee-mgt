import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { User } from "../entity/user.entity";
import * as bcrypt from "bcrypt";
import { SendEmailDto } from "../dto/send.mail.dto";
import { Roles } from "../model/role.model";
import { EventHelper } from "src/helpers/events.helper";
import { RegisterDto } from "../dto/register.dto";
import { ResponseService } from "src/response/response.service";
import { LoginDto } from "../dto/login.dto";
import { LoginOtpDto } from "../dto/login-otp.dto";
import { PasswordChangeConfirmOptDto } from "../dto/password-reset-confirm-opt.dto";
import { RedisHelper } from "src/helpers/redis-helper";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const otpGenerator = require("otp-generator");

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly eventHelper: EventHelper,
    private readonly redisHelper: RedisHelper,
    private readonly response: ResponseService,
  ) {}
  async findAll() {
    return await User.find({
      relations: ["detail"],
      where: { role: Roles.User },
      order: { created_at: "DESC" },
    });
  }
  async registerUser(registerDto: RegisterDto) {
    const foundUser = await this.findUserByUsername(registerDto.username);
    if (foundUser != null) {
      this.logger.warn(`Username already used: ${registerDto.username}`);
      throw new BadRequestException("Username has been already used");
    }
    const foundUserPhone = await this.findUserByPhone(registerDto.phoneNumber);
    if (foundUserPhone != null) {
      this.logger.warn(`Phone number already used: ${registerDto.phoneNumber}`);
      throw new BadRequestException("Phone number has been already used");
    }
    const foundUserEmail = await this.findUserByEmail(registerDto.email);
    if (foundUserEmail != null) {
      this.logger.warn(`Email already used: ${registerDto.email}`);
      throw new BadRequestException("Email has been already used");
    }
    try {
      const user = new User();
      user.names = registerDto.names;
      user.username = registerDto.username;
      user.role = Roles.Admin;
      user.password = registerDto.password;
      user.phoneNumber = registerDto.phoneNumber;
      user.email = registerDto.email;
      const data = await user.save();
      this.logger.log(`User successfully registered with ID: ${data.id}`);
      return this.response.postResponse(data.id);
    } catch (e) {
      this.logger.error("registration failed...", e);
      throw new BadRequestException("registration failed... ", e);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) throw new BadRequestException("Invalid login credentials");
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });

    this.logger.log(`Generated OTP: : ${otp}`);
    this.redisHelper.set(`login-opt-${otp}`, user);
    const emailDto: SendEmailDto = {
      email: user.email,
      message: `Code: ${otp} use is to verify your login. Don't share it with anyone. It will expire in 10 minutes.`,
      names: user.names,
    };
    await this.eventHelper.sendEvent(
      "Send SMS",
      emailDto,
      process.env.SEND_EMAIL_REQUEST_TOPIC,
    );
    const message = `We have sent you an OTP to your email for verification process`;
    const response = this.response.customRespose(message, HttpStatus.OK);
    return response;
  }
  async validateOtpMessage(loginOtpDto: LoginOtpDto) {
    const user = await this.redisHelper.get(`login-opt-${loginOtpDto.otp}`);
    if (!user) throw new BadRequestException("Invalid OTP");
    return user;
  }
  async forgetPasswordRequestOtp(username: string) {
    const user = await User.findOne({
      where: { username },
    });
    if (!user) throw new BadRequestException("Invalid username");
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });

    console.log("Generated OTP: " + otp);
    this.redisHelper.set(`password-reset-opt-${otp}`, user);

    const emailDto: SendEmailDto = {
      email: user.email,
      message: `Code: ${otp} use it to change your password. Don't share it with anyone. It will expire in 10 minutes.`,
      names: user.names,
    };

    await this.eventHelper.sendEvent(
      "Send Email",
      emailDto,
      process.env.SEND_EMAIL_REQUEST_TOPIC,
    );

    const message =
      "We have sent you an OTP to your email for verification process";
    const response = this.response.customRespose(message, HttpStatus.OK);
    return response;
  }

  async changePasswordByValidateOtp(
    passwordResetConfirmOptDto: PasswordChangeConfirmOptDto,
  ) {
    if (
      passwordResetConfirmOptDto.password !=
      passwordResetConfirmOptDto.passwordRetyped
    ) {
      throw new BadRequestException("Password must match");
    }
    const user: User = await this.redisHelper.get(
      `password-reset-opt-${passwordResetConfirmOptDto.otp}`,
    );
    if (!user) throw new BadRequestException("Invalid OTP");
    await this.resetPassword(user.id, passwordResetConfirmOptDto.password);
    await this.redisHelper.del(
      `password-reset-opt-${passwordResetConfirmOptDto.otp}`,
    );

    const message = "Password resetting was completely successfully";
    const response = this.response.customRespose(message, HttpStatus.OK);
    return response;
  }
  async passwordResetRequestOtp(username: string) {
    const user = await User.findOne({
      where: { username },
    });
    if (!user) throw new BadRequestException("Invalid username");
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });

    console.log("Generated OTP: " + otp);
    this.redisHelper.set(`password-reset-opt-${otp}`, user);

    const emailDto: SendEmailDto = {
      email: user.email,
      message: `Code: ${otp} use it to reset your password. Don't share it with anyone. It will expire in 10 minutes.`,
      names: user.names,
    };

    await this.eventHelper.sendEvent(
      "Send Email",
      emailDto,
      process.env.SEND_EMAIL_REQUEST_TOPIC,
    );

    const message =
      "We have sent you an OTP to your email for verification process";
    const response = this.response.customRespose(message, HttpStatus.OK);
    return response;
  }
  async resettingPassword(
    req: any,
    passwordResetConfirmOptDto: PasswordChangeConfirmOptDto,
  ) {
    const token = req.headers.authorization.split(" ")[1];
    const userReq = req.user;

    const user: User = await this.redisHelper.get(
      `password-reset-opt-${passwordResetConfirmOptDto.otp}`,
    );
    if (!user) throw new BadRequestException("Invalid OTP");

    if (user.id != userReq.id) {
      throw new BadRequestException(
        "The user requesting the password reset does not match the logged-in user.",
      );
    }
    if (
      passwordResetConfirmOptDto.password !=
      passwordResetConfirmOptDto.passwordRetyped
    ) {
      throw new BadRequestException("Password must match");
    }
    await this.resetPassword(user.id, passwordResetConfirmOptDto.password);
    await this.redisHelper.del(
      `password-reset-opt-${passwordResetConfirmOptDto.otp}`,
    );
    return { message: "Password was reset successfully" };
  }

  async findUserByUsername(username: string) {
    return User.findOne({ where: { username } });
  }
  async findUserByEmail(email: string) {
    return User.findOne({ where: { email } });
  }
  async findUserByPhone(phoneNumber: string) {
    return User.findOne({ where: { phoneNumber } });
  }
  findById(id: string) {
    return User.findOne({ where: { id } });
  }

  async resetPassword(userId: string, password: string) {
    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(password, salt);
    return User.update({ id: userId }, { password: newPassword });
  }
  async passwordForgetRequestOtp(username: string) {}
  async validateUser(username: string, password: string) {
    const user = await this.findUserByUsername(username);
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    return user;
  }
}
