import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Request,
  Post,
  Put,
  UseGuards,
  Query,
  Param,
  Res,
  StreamableFile,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CustomAuthGuard } from "src/auth/custom.guard";
import { HasRoles } from "src/auth/has-roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { AttendanceDto } from "../dto/attendance.dto";
import { AttendanceReportService } from "../reports/attendance.report.service";
import { AttendanceService } from "../service.ts/attendance.service";
import { jsPDF } from "jspdf";
import { Response } from "express";

@ApiTags("attendance module end-points")
@Controller({ version: "1", path: "/attendance" })
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService,
    private readonly attendanceReportService: AttendanceReportService,
  ) {}

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Post("")
  async recordAttendance(@Body() attendanceDto: AttendanceDto) {
    return this.attendanceService.recordAttendance(attendanceDto);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Get("report")
  async getAttendanceReport(
    @Query("date") dateString: string,
  ): Promise<StreamableFile> {
    const date = new Date(dateString);
    const pdfBuffer =
      await this.attendanceReportService.generateAttendanceReport(date);

    const fileName = `attendance-report-${dateString}.pdf`;
    const stream = new StreamableFile(pdfBuffer);
    return stream;
  }
}
