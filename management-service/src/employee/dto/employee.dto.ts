import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EmployeeShfitHours } from "../enums/employee.shift.enum";
export class EmployeeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  names: string;

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

  @ApiProperty({
    description: "The shift period for employee",
    enum: EmployeeShfitHours,
  })
  @IsEnum(EmployeeShfitHours, {
    message: "Shfit hour  must be either 'morning' or 'afternoon' or 'night'.",
  })
  @IsNotEmpty({ message: "Shift period is required." })
  shift: EmployeeShfitHours;
}
