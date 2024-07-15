import { HttpStatus } from "../enums/httpStatus.enum";

export interface IErrorResponse {
  status: HttpStatus;
  success: boolean;
  error: {
    message: string;
    details: string[];
  };
}

export interface ISuccessResponse {
  status: HttpStatus;
  success: boolean;
  results: Record<string, unknown>;
}
