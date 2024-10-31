import { Attendance } from "src/attendance/entity/attendance.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EmployeeShfitHours } from "../enums/employee.shift.enum";

@Entity("employee")
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  names: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ default: 1 })
  status: number;

  @Column()
  shift: EmployeeShfitHours;

  @Column()
  empIdentifier: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendance: Attendance[];
}
