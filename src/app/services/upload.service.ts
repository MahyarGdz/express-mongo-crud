import { RequestHandler, Request } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { Logger } from "../../logging/logger";
import { BadRequestError } from "../../common/types/app.Errors";
import { UploadMessage } from "../../common/enums/messages.enum";

class UploadSerive {
  private static instance: UploadSerive;
  private logger = new Logger();
  private option: fileUpload.Options = {
    limits: { fileSize: 1 * 1024 * 1024 /*1Mb*/ },
    useTempFiles: true,
    tempFileDir: "./tmp/",
    abortOnLimit: true,
    // responseOnLimit:
    // createParentPath,
  };
  private constructor() {}
  static get(): UploadSerive {
    if (!UploadSerive.instance) {
      UploadSerive.instance = new UploadSerive();
    }
    return UploadSerive.instance;
  }

  public init() {
    return fileUpload(this.option);
  }

  public single(fieldName: string): RequestHandler {
    return async (req: Request, _res, next) => {
      try {
        if (!req.files || Object.keys(req.files).length === 0) {
          throw new BadRequestError(UploadMessage.NoFileUploaded);
        }

        const file = req.files[fieldName] as UploadedFile;
        req.file = file;
        next();
      } catch (error) {
        this.logger.error("error uploading file", error);
        next(error);
      }
    };
  }
}

const instance = UploadSerive.get();

export { instance as UploadSerive };
