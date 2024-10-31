import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { EmployeeIdGeneratorHelper } from "src/helpers/emp.id.generator.helper";
import { FilterHelper } from "src/helpers/filter.helper";
import { HelperModule } from "src/helpers/helper.module";
import { ResponseModule } from "src/response/response.module";
import { UserModule } from "src/users/user.module";
import { EmployeeController } from "./controller/employee.controller";
import { EmployeeService } from "./service/employee.service";

@Module({
  imports: [ResponseModule, HelperModule, UserModule, AuthModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, FilterHelper, EmployeeIdGeneratorHelper],
  exports: [EmployeeService],
})
export class EmployeeModule {}
