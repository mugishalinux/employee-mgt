import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { EmailDto } from "../dto/sms.dto";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

@Injectable()
export class QueeingMailsService {
  constructor(
    @InjectQueue(process.env.QUEUE_NAME) private readonly queue: Queue,
  ) {}
  async queueEmails(payload: EmailDto) {
    console.log("SMS Request: ", payload);
    await this.queue.add(payload, {
      attempts: Number(process.env.QUEUE_RETRIES), // Number of retries if the job fails
    });
  }
}
