import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import * as dotenv from "dotenv";
import { Not } from "typeorm";
import { UserService } from "src/users/service/user.service";
import { User } from "src/users/entity/user.entity";
import { Blacklist } from "src/users/blacklist.entity";
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateOtp(otp: string) {
    return await User.findOne({ where: { id: Not("0") } });
    // return null;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUserByUsername(username);
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    return user;
  }
  async login(user: User) {
    const payload = {
      username: user.username,
      names: user.names,
      sub: user.id,
    };
    return {
      userId: user.id,
      names: user.names,
      access_token: this.jwtService.sign(payload),
    };
  }
  async logout(token: string) {
    const isTokenExist = await Blacklist.findOne({ where: { token } });
    if (!isTokenExist) {
      const blacklist = new Blacklist();
      blacklist.token = token;
      blacklist.created_at = new Date();
      try {
        await blacklist.save();
      } catch (err) {
        console.log(err);
      }
    }
  }
}
