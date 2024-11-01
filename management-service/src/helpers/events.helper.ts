import { Injectable } from "@nestjs/common";
import { KafkaHelper } from "./kafka.helper";

@Injectable()
export class EventHelper {
  constructor(private readonly kafkaHelper: KafkaHelper) {}

  async sendEvent(message: string, data: any, topic: string) {
    message = `[Attendance management] ${message}`;

    await this.kafkaHelper.send(data, message, topic);
  }
}
