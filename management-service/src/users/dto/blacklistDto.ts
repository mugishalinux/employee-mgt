import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class BlacklistDto {
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
