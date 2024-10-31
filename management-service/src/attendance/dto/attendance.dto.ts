import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum } from "class-validator";
import { AttendanceType } from "../enums/attendance.type.enum";

export class AttendanceDto {
  @ApiProperty({ description: "The ID of the employee" })
  @IsNotEmpty({ message: "Employee ID is required." })
  employeeId: string;

  @ApiProperty({
    description: "The type of attendance record",
    enum: AttendanceType,
  })
  @IsEnum(AttendanceType, {
    message: "Attendance type must be either 'Arrival' or 'Leave'.",
  })
  @IsNotEmpty({ message: "Attendance type is required." })
  attendanceType: AttendanceType;
}
