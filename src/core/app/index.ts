import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { IAppOptions } from "../../common/interfaces/IAppOptions";

class ExpressApp {
  private app: Application;
  private port: number;
  private static instance: ExpressApp;
  private options: IAppOptions = {
    cors: { origin: true, optionsSuccessStatus: 204, credentials: true },
    rate: {
      message: "Too many requests from this IP, please try again after an hour",
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 60, // Limit each IP to 50 requests per  5
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    },
  };

  private constructor() {}

  static get() {
    if (!ExpressApp.instance) {
      ExpressApp.instance = new ExpressApp();
    }
    return ExpressApp.instance;
  }

  initApp(): ExpressApp {
    if (!this.app) {
      this.app = express();
    }
    return this;
  }

  plugMiddlewares(): ExpressApp {
    /**
     * remove x-powerd-by for security reason
     */
    this.app.disable("x-powered-by");
    /**
     * parse the incoming request body payload
     */
    this.app.use(express.json());
    /**
     * compress the response payload
     */
    this.app.use(compression());
    /**
     * check the request origin and response to allowed origin
     */
    this.app.use(cors(this.options.cors));

    /**
     * add ratelimit middleware to track the user request count in specfic time to -
     * prevent spam request or bruteforce attack
     */
    this.app.use("/api", rateLimit(this.options.rate));

    return this;
  }

  catchError(): ExpressApp {
    this.app.use();
    this.app.use();
    return this;
  }
}

export { ExpressApp };
