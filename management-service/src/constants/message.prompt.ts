export class AttendanceMessage {
  private employeeName: string;
  private time: string;
  private shift: string;
  private shiftTime: string;

  constructor(attendanceInfo: {
    employeeName: string;
    time: string;
    shift: string;
    shiftTime: string;
  }) {
    this.employeeName = attendanceInfo.employeeName;
    this.time = attendanceInfo.time;
    this.shift = attendanceInfo.shift;
    this.shiftTime = attendanceInfo.shiftTime;
  }

  getAttendanceInfo() {
    return {
      employeeName: this.employeeName,
      time: this.time,
      shift: this.shift,
      shiftTime: this.shiftTime,
    };
  }

  checkInMessagePrompt(): string {
    return `Generate a email message which is informative the employee his/her that arrival attendance action was successfully recorded but in email don't add any name like hello or dear ..name cause i will mention in title myself:
     attendance recorded at ${this.time} for ${this.shift} shift (${this.shiftTime}).
      Make it one professional , informative, and politely focusing on the attendance record.`;
  }

  checkOutMessagePrompt(): string {
    return `Generate a email message which is infromative the employee his/her that leave attendance action was successfully recorded but in email don't add any name like hello or dear ..name cause i will mention in title myself:
     attendance recorded at ${this.time} for ${this.shift} shift (${this.shiftTime}).
      Make it one professional , informative, and politely focusing on the attendance record.`;
  }
}
