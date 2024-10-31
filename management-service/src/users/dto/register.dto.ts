import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  NotContains,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class RegisterDto {
  @IsNotEmpty()
  @NotContains(" ")
  @IsString()
  @ApiProperty()
  names: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Matches(/(2507[8,2,3,9])[0-9]{7}/, {
    message:
      "Phone number must be Airtel or MTN number formatted like 250*********",
  })
  @ApiProperty({
    description: "User's phone number.",
    example: "25078xxxxxxx",
  })
  phoneNumber: string;

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
}
