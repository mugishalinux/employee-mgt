import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { AttendanceStatus } from "../enums/attendance.status.enum";

@Injectable()
export class AttendanceReportService {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

  async generateAttendanceReport(date: Date): Promise<Buffer> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    const query = `
      SELECT e.id, e.names, e.email, e.phoneNumber, e.shift,
             a.arrivalTime, a.departureTime, a.attendanceStatus
      FROM employee e
      LEFT JOIN attendances a ON e.id = a.employeeId AND a.date >= ? AND a.date < ?
      ORDER BY e.names;
    `;

    const result = await this.entityManager.query(query, [targetDate, nextDay]);
    const doc = new jsPDF();
    // Title
    doc.setFontSize(16);
    doc.text("Attendance Report", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Date: ${targetDate.toLocaleDateString()}`, 105, 30, {
      align: "center",
    });

    if (result.length === 0) {
      doc.text("No attendance records found for this date.", 105, 40, {
        align: "center",
      });
    } else {
      const columns = [
        "Name",
        "Shift",
        "Arrival Time",
        "Departure Time",
        "Status",
      ];
      const rows = result.map((emp) => [
        emp.names,
        emp.shift,
        emp.arrivalTime
          ? new Date(emp.arrivalTime).toLocaleTimeString()
          : "---",
        emp.departureTime
          ? new Date(emp.departureTime).toLocaleTimeString()
          : "---",
        emp.attendanceStatus || AttendanceStatus.Absent,
      ]);

      (doc as any).autoTable({
        head: [columns],
        body: rows,
        startY: 40,
      });
    }
    const pdfOutput = doc.output("arraybuffer");
    return Buffer.from(pdfOutput);
  }
}
