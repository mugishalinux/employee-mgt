import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Employee } from "src/employee/entity/employee.entity";
import { ShiftHours } from "../constants/attendance.daily.shift";
import { AttendanceDto } from "../dto/attendance.dto";
import { AttendanceStatus } from "../enums/attendance.status.enum";
import { Attendance } from "../entity/attendance.entity";
import { AttendanceType } from "../enums/attendance.type.enum";
import { ResponseService } from "src/response/response.service";
import { Between } from "typeorm";
import { SendEmailDto } from "src/constants/email.template.dto";
import { EventHelper } from "src/helpers/events.helper";
import "dotenv/config";
import { OpenAIHelperService } from "src/helpers/openai.helper";
import { AttendanceMessage } from "src/constants/message.prompt";

@Injectable()
export class AttendanceService {
  constructor(
    private response: ResponseService,
    private openAiHelperService: OpenAIHelperService,
    private readonly eventHelper: EventHelper,
  ) {}
  async recordAttendance(attendanceDto: AttendanceDto) {
    const { employeeId, attendanceType } = attendanceDto;

    const employee = await Employee.findOne({ where: { id: employeeId } });
    if (!employee) {
      throw new BadRequestException(
        `Employee with ID ${employeeId} doesn't exist`,
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const existingToday = await Attendance.findOne({
      where: {
        employee: { id: employee.id },
        date: Between(today, tomorrow),
      },
      order: { date: "DESC" },
    });

    if (existingToday) {
      if (
        attendanceType === AttendanceType.Arrival &&
        existingToday.arrivalTime
      ) {
        throw new BadRequestException("Arrival already recorded for today.");
      }
      if (
        attendanceType === AttendanceType.Leave &&
        existingToday.departureTime
      ) {
        throw new BadRequestException("Departure already recorded for today.");
      }
    } else {
      if (attendanceType == AttendanceType.Leave) {
        throw new BadRequestException(
          "Can't record leave attendance, with no arrival attandence done for today.",
        );
      }
    }
    try {
      // Determine lateness based on shift hours
      const currentTime = new Date(); // Resetting this to current time
      const shift = ShiftHours[employee.shift];
      const isLate =
        currentTime.getHours() >= parseInt(shift.start.split(":")[0]);

      const newAttendance = new Attendance();
      newAttendance.employee = employee;
      newAttendance.date = currentTime;
      newAttendance.attendanceStatus = isLate
        ? AttendanceStatus.Late
        : AttendanceStatus.Present;
      newAttendance.status = "1";
      const attendanceInfo = new AttendanceMessage({
        employeeName: newAttendance.employee.names,
        time: this.getCurrentTime(currentTime),
        shift: newAttendance.employee.shift,
        shiftTime: `${ShiftHours[employee.shift].start} - ${
          ShiftHours[employee.shift].end
        }`,
      });

      if (attendanceType === AttendanceType.Arrival) {
        newAttendance.arrivalTime = currentTime;
        newAttendance.attendanceStatus = isLate
          ? AttendanceStatus.Late
          : AttendanceStatus.DepartureMissing;
        await newAttendance.save();
        const checkInPrompt = attendanceInfo.checkInMessagePrompt();
        const emailDto = new SendEmailDto();
        emailDto.message = await this.openAiHelperService.generateEmailContent(
          checkInPrompt,
        );
        emailDto.email = newAttendance.employee.email;
        emailDto.names = newAttendance.employee.names;
        await this.eventHelper.sendEvent(
          "Send Email",
          emailDto,
          process.env.SEND_EMAIL_REQUEST_TOPIC,
        );

        return this.response.customRespose(
          "Attendance successfully recorded",
          HttpStatus.CREATED,
        );
      } else {
        const checkOutPrompt = attendanceInfo.checkOutMessagePrompt();
        const emailDto = new SendEmailDto();
        emailDto.message = await this.openAiHelperService.generateEmailContent(
          checkOutPrompt,
        );
        emailDto.email = newAttendance.employee.email;
        emailDto.names = newAttendance.employee.names;
        await this.eventHelper.sendEvent(
          "Send Email",
          emailDto,
          process.env.SEND_EMAIL_REQUEST_TOPIC,
        );
        existingToday.departureTime = currentTime;
        existingToday.attendanceStatus = AttendanceStatus.Present;
        existingToday.updated_at = new Date();
        await Attendance.update(existingToday.id, existingToday);
        return this.response.customRespose(
          "Attendance successfully updated",
          HttpStatus.OK,
        );
      }
    } catch (e) {
      throw new BadRequestException(
        `Error occurred while saving attendance: ${e.message}`,
      );
    }
  }
  getCurrentTime(date: Date): string {
    const timeString: string = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return timeString;
  }
}
