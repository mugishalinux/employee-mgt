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
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomAuthGuard } from "src/auth/custom.guard";
import { HasRoles } from "src/auth/has-roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { EmployeeDto } from "../dto/employee.dto";
import { EmployeeService } from "../service/employee.service";

@ApiTags("employee module end-points")
@Controller({ version: "1", path: "/employee" })
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Post("")
  async createEmployee(@Body() employeeDto: EmployeeDto) {
    return this.employeeService.createEmployee(employeeDto);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Put("update-employee/:id")
  async updateEmployee(
    @Param("id") id: string,
    @Body() employeeDto: EmployeeDto,
  ) {
    return this.employeeService.updateEmployeeData(id, employeeDto);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Get()
  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiQuery({ required: false, name: "search" })
  @UseGuards(CustomAuthGuard)
  async getAllEmployees(
    @Request() req,
    @Query("pageNumber") pageNumber: number,
    @Query("pageSize") pageSize: number,
  ) {
    return this.employeeService.getAllEmployee(pageSize, pageNumber);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Get("single-employee/:id")
  async getSingleEmployeeById(@Param("id") id: string) {
    return this.employeeService.getSingleEmployee(id);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Put("delete-employee/:id")
  async deleteEmployee(@Param("id") id: string) {
    return this.employeeService.deleteEmployee(id);
  }
}
