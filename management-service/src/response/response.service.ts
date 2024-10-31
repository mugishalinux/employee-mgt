import { HttpStatus, Injectable } from "@nestjs/common";
import { ResponseDto } from "./response.dto";

@Injectable()
export class ResponseService {
  postResponse(id: string): ResponseDto {
    const response = new ResponseDto();
    response.status = HttpStatus.CREATED;
    response.message = "successfully created";
    response.id = id;
    return response;
  }
  updateResponse(id: string): ResponseDto {
    const response = new ResponseDto();
    response.status = HttpStatus.OK;
    response.message = "successfully updated";
    response.id = id;
    return response;
  }
  customRespose(message: string, HttpStatus) {
    return {
      HttpStatus: HttpStatus,
      message: message,
    };
  }
  deleteResponse(id: string): ResponseDto {
    const response = new ResponseDto();
    response.status = HttpStatus.OK;
    response.message = "successfully deleted";
    response.id = id;
    return response;
  }
}
