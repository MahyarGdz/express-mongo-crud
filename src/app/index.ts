import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { IAppOptions } from "../common/interfaces/IAppOptions";
import { apiRouter } from "./routers/api.routes";
import { errorHandler, notFoundHandler } from "./handler/app.errorHandler";
import { Authenticate } from "./utils/authenticate";
import { customMorganFormat, stream } from "../logging/morgan";
import { join } from "path";
import ENV from "../config/env.config";

class ExpressApp {
  app: Application;
  private static instance: ExpressApp;
  private options: IAppOptions = {
    cors: { origin: true, optionsSuccessStatus: 204, credentials: true },
    rate: {
      message: "Too many requests from this IP, please try again after an hour",
      windowMs: 5 * 60 * 1000, // 5 min
      max: 60, // each ip has 60 request per 5 min
      standardHeaders: true, // `RateLimit-*` headers
      legacyHeaders: false, // disable the `X-RateLimit-*` headers
    },
  };

  private constructor() {}

  static get() {
    if (!ExpressApp.instance) {
      ExpressApp.instance = new ExpressApp();
    }
    return ExpressApp.instance;
  }

  init(): ExpressApp {
    if (!this.app) {
      this.app = express();
    }
    return this;
  }

  plug(): ExpressApp {
    /**
     * remove x-powerd-by for security reason
     */
    this.app.disable("x-powered-by");
    /**
     * parse the incoming request body payload
     */
    this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: true }));

    /**
     * serve static file
     */
    this.app.use("/images", express.static(join(ENV.UPLOADS_FOLDERS)));
    /**
     * compress the response payload
     */
    this.app.use(compression());

    /**
     * log the incomign request
     */
    this.app.use(morgan(customMorganFormat, { stream }));

    /**
     * check the request origin and response to allowed origin
     */
    this.app.use(cors(this.options.cors));

    /**
     * add ratelimit middleware to track the user request count in specfic time to -
     * prevent spam request or bruteforce attack
     */
    this.app.use("/api", rateLimit(this.options.rate));

    /**
     * initalize passport to handle jwt authorization
     */
    this.app.use(Authenticate.init());
    Authenticate.plug();
    /**
     * attach router
     */
    this.app.use("/api", apiRouter);

    return this;
  }

  catchError(): ExpressApp {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
    return this;
  }
}

const expressApp = ExpressApp.get().init().plug().catchError().app;

export { expressApp as Application };
