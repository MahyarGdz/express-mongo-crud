import autoBind from "auto-bind";
import { Request, Response } from "express";
import { HttpStatus } from "../enums/httpStatus.enum";
import { ResponseFactory } from "../factories/response.factory";

type Context = {
  req: Request;
  res: Response;
};

abstract class BaseController {
  constructor() {
    autoBind(this);
  }

  protected async json(context: Context, data: Record<string, any>, status: HttpStatus = 200) {
    const response = ResponseFactory.successResponse(status, data);
    return context.res.status(status).json(response);
  }

  protected async ok(context: Context, msg: string = "ok") {
    return context.res.status(200).send(msg);
  }
}

export default BaseController;
