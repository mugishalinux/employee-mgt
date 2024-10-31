import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthModule } from "src/auth/auth.module";
import { EmployeeModule } from "src/employee/employee.module";
import { FilterHelper } from "src/helpers/filter.helper";
import { HelperModule } from "src/helpers/helper.module";
import { OpenAIHelperService } from "src/helpers/openai.helper";
import { ResponseModule } from "src/response/response.module";
import { UserModule } from "src/users/user.module";
import { AttendanceController } from "./controller/attendance.controller";
import { AttendanceReportService } from "./reports/attendance.report.service";
import { AttendanceService } from "./service.ts/attendance.service";

@Module({
  imports: [
    AuthModule,
    UserModule,
    ResponseModule,
    EmployeeModule,
    HelperModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    FilterHelper,
    ConfigService,
    OpenAIHelperService,
    AttendanceReportService,
  ],
  exports: [],
})
export class AttendanceModule {}
