import morgan from "morgan";
import { Request, Response } from "express";
import ansiColor from "ansi-colors";
import { Logger } from "./logger";

const logger = new Logger();

morgan.token("coloredMethod", (req: Request) => {
  const method = req.method;
  let color;

  switch (method) {
    case "GET":
      color = ansiColor.cyan;
      break;
    case "POST":
      color = ansiColor.blue;
      break;
    case "PUT":
      color = ansiColor.yellow;
      break;
    case "DELETE":
      color = ansiColor.red;
      break;
    default:
      color = ansiColor.white;
      break;
  }

  return color(method);
});

morgan.token("coloredStatus", (_req: Request, res: Response) => {
  const status = res.statusCode;
  let color;

  // Set color based on status code
  if (status >= 500) {
    color = ansiColor.red;
  } else if (status >= 400) {
    color = ansiColor.yellow;
  } else if (status >= 300) {
    color = ansiColor.cyan;
  } else if (status >= 200) {
    color = ansiColor.magenta;
  } else {
    color = ansiColor.white;
  }

  return color(status.toString());
});

const customMorganFormat = ":coloredMethod :url :coloredStatus :response-time ms - :res[content-length]";

const stream = {
  write: (message: string) => {
    logger.info(message.trim(), "HTTP");
  },
};

export { stream, customMorganFormat };
