import { CorsOptions } from "cors";
import { Options } from "express-rate-limit";

export interface IAppOptions {
  cors: CorsOptions;
  rate: Partial<Options>;
}
