import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Blacklist } from "src/users/blacklist.entity";

@Injectable()
export class CustomAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check if the token is valid using the built-in JWT strategy
    const isAuthValid = (await super.canActivate(context)) as boolean;
    if (!isAuthValid) {
      return false;
    }

    // If token is valid, check against the blacklist
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];
    if (await this.isTokenBlacklisted(token)) {
      throw new UnauthorizedException("Token is blacklisted");
    }

    return true;
  }

  private async isTokenBlacklisted(token: string): Promise<boolean> {
    if (!token) {
      return false;
    }
    const blacklistEntry = await Blacklist.findOne({ where: { token } });
    return !!blacklistEntry;
  }
}
