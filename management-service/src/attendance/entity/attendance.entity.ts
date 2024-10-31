import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Employee } from "src/employee/entity/employee.entity";
import { AttendanceStatus } from "../enums/attendance.status.enum";

@Entity("attendances")
export class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  arrivalTime: Date;

  @Column({ nullable: true })
  departureTime: Date;

  @Column()
  date: Date;

  @Column({ nullable: true })
  comment: string;

  @Column()
  attendanceStatus: AttendanceStatus;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Employee, (employee) => employee.attendance)
  employee: Employee;
}
