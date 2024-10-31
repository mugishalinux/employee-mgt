import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Blacklist } from "../blacklist.entity";

@Injectable()
export class DeleteExpiredTokens {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  private readonly logger = new Logger(DeleteExpiredTokens.name);

  @Cron("*/3 * * * * *")
  async deleteExpiredTokens() {
    // this.logger.log("worked");
    const oneMinuteAgo = new Date(Date.now() - 5000 * 60 * 1000);

    const tokensToDelete = await Blacklist.createQueryBuilder()
      .where("created_at <= :oneMinuteAgo", { oneMinuteAgo })
      .getMany();

    for (const token of tokensToDelete) {
      await token.remove();
    }
  }
}
