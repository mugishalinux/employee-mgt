import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { attendanceEmailTemplate } from "../constanst/attendance.email.templates";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { EmailDto } from "./dto/sms.dto";
dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

@Processor(process.env.QUEUE_NAME)
export class MailingProcessor {
  private readonly transporter;
  constructor() {
    {
      this.transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.SMTPUSERNANE,
          pass: process.env.SMTPEMAIL, // Use your Gmail app password here
        },
      });
    }
  }
  @Process()
  async sendSMS(job: Job) {
    try {
      const data: EmailDto = job.data;
      const emailHtml = attendanceEmailTemplate(`${data.names}`, data.message);
      const info = await this.transporter.sendMail({
        from: process.env.SMTPUSERNANE,
        to: data.email,
        subject: "Attendance Management Notification",
        html: emailHtml,
        text: `Hello ${data.names}, \n\n${data.message}`,
      });

      console.log("Email sent:", info.response);
      console.log("data to submit : ", job.data);
    } catch (e) {
      console.log(e);
    }
  }
}
