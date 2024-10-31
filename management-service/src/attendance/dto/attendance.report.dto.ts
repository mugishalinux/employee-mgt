export class AttendanceReportDto {
  id: string;
  names: string;
  email: string;
  phoneNumber: string;
  shift: string;
  attendance: {
    arrivalTime: string;
    departureTime: string;
    status: string;
  };
}
