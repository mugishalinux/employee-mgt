import { BadRequestException, Injectable } from "@nestjs/common";
import { EmployeeIdGeneratorHelper } from "src/helpers/emp.id.generator.helper";
import { FilterHelper } from "src/helpers/filter.helper";
import { Not } from "typeorm";
import { ResponseService } from "../../response/response.service";
import { EmployeeDto } from "../dto/employee.dto";
import { Employee } from "../entity/employee.entity";

@Injectable()
export class EmployeeService {
  constructor(
    private response: ResponseService,
    private readonly filter: FilterHelper,
    private employeeIdGeneratorHelper: EmployeeIdGeneratorHelper,
  ) {}
  async createEmployee(createEmployeeDto: EmployeeDto) {
    //check if phoneNumber doesn't exist
    const isPhoneNumberExist = await Employee.findOneBy({
      phoneNumber: createEmployeeDto.phoneNumber,
    });
    if (isPhoneNumberExist)
      throw new BadRequestException(
        `Employee with phone number :: +${createEmployeeDto.phoneNumber} already exist`,
      );
    //check if email doesn't exist
    const isEmailExist = await Employee.findOneBy({
      email: createEmployeeDto.email,
    });
    if (isEmailExist)
      throw new BadRequestException(
        `Employee with email :: ${createEmployeeDto.email} already exist`,
      );
    const employee = new Employee();
    employee.names = createEmployeeDto.names;
    employee.phoneNumber = createEmployeeDto.phoneNumber;
    employee.email = createEmployeeDto.email;
    employee.shift = createEmployeeDto.shift;
    employee.empIdentifier =
      this.employeeIdGeneratorHelper.generateIdentifier();
    employee.status = 1;
    try {
      const data = await employee.save();
      return this.response.postResponse(data.id);
    } catch (error) {
      throw new BadRequestException("Employee creation failed... : ", error);
    }
  }
  async updateEmployeeData(id: string, employeeDto: EmployeeDto) {
    //check if a employee exist
    const employeeExist = await Employee.findOneBy({
      status: Not(2),
      id: id,
    });
    if (!employeeExist)
      throw new BadRequestException(`Employee with id :: ${id} not found`);

    //check if the email is eqaul to the new email user want to update
    if (employeeExist.phoneNumber != employeeDto.phoneNumber) {
      //check if email doesn't exist
      const isPhoneNumberExist = await Employee.findOneBy({
        phoneNumber: employeeDto.phoneNumber,
      });
      if (isPhoneNumberExist)
        throw new BadRequestException(
          `Employee with phone number +${employeeDto.phoneNumber} already exist`,
        );
    }

    //check if the email is eqaul to the new email user want to update
    if (employeeExist.email != employeeDto.email) {
      //check if email doesn't exist
      const isEmailExist = await Employee.findOneBy({
        email: employeeDto.email,
      });
      if (isEmailExist)
        throw new BadRequestException(
          `Employee with email ${employeeDto.names} already exist`,
        );
    }

    employeeExist.names = employeeDto.names;
    employeeExist.phoneNumber = employeeDto.phoneNumber;
    employeeExist.email = employeeDto.email;
    employeeExist.shift = employeeDto.shift;
    try {
      await Employee.update(id, employeeExist);
      return this.response.updateResponse(employeeExist.id);
    } catch (error) {
      throw new BadRequestException("Update employee failed...: ", error);
    }
  }

  async getAllEmployee(pageSize: number, pageNumber: number) {
    try {
      const employee = await this.filter.paginate(
        Employee,
        pageSize || 10,
        pageNumber || 1,
        { status: Not(2) },
      );
      return employee;
    } catch (e) {
      console.error("Failed to retrieve employees:", e);
      throw new BadRequestException(
        `Error occurred while retrieving employees: ${e.message}`,
      );
    }
  }
  async getSingleEmployee(id: string): Promise<Employee> {
    try {
      const employee = await Employee.findOne({
        where: { id, status: Not(2) },
      });
      if (!employee) {
        throw new BadRequestException(`Employee with id: ${id} not found`);
      }
      return employee;
    } catch (e) {
      throw new BadRequestException(
        `Error occurred while retrieving employee: ${e.message}`,
      );
    }
  }
  async deleteEmployee(id: string) {
    const employee = await Employee.findOneBy({ id });
    if (!employee) {
      throw new BadRequestException(`Employee with id: ${id} not found`);
    }
    //flag this ticket as deleted
    employee.status = 2;
    try {
      const data = await employee.save();
      return this.response.deleteResponse(data.id);
    } catch (e) {
      console.error("Failed to retrieve employee:", e);
      throw new BadRequestException(
        `Error occurred while retrieving employee: ${e.message}`,
      );
    }
  }
}
