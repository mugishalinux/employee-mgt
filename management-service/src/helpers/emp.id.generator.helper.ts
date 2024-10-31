import { Injectable } from "@nestjs/common";
import { KafkaHelper } from "./kafka.helper";

@Injectable()
export class EmployeeIdGeneratorHelper {
  constructor() {}
  public generateIdentifier(): string {
    const numbers = "0123456789";
    let randomNumber = "";
    for (let i = 0; i < length; i++) {
      randomNumber += numbers.charAt(
        Math.floor(Math.random() * numbers.length),
      );
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `E-MGT${year}${month}${day}-${randomNumber}`;
  }
}
