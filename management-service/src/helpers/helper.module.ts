import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventHelper } from "./events.helper";
import { KafkaHelper } from "./kafka.helper";
import { OpenAIHelperService } from "./openai.helper";
import { RedisHelper } from "./redis-helper";

@Module({
  imports: [],
  controllers: [],
  providers: [
    KafkaHelper,
    EventHelper,
    RedisHelper,
    ConfigService,
    OpenAIHelperService,
  ],
  exports: [KafkaHelper, EventHelper, RedisHelper],
})
export class HelperModule {}
