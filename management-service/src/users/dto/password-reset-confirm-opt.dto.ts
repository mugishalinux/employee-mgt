import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PasswordChangeConfirmOptDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  @ApiProperty()
  passwordRetyped: string;

  @IsNotEmpty()
  @ApiProperty()
  otp: string;
}
