import winston, { Logger as WinstonLogger } from "winston";
import colors from "ansi-colors";

const { combine, timestamp, printf } = winston.format;

const logLevelColor: Record<string, keyof typeof colors> = {
  error: "red",
  warn: "yellow",
  info: "green",
  verbose: "cyan",
  debug: "blue",
};

const customFormat1 = printf(({ level, message, timestamp, context = "Application", ...meta }) => {
  return `[${timestamp}] [${context}] [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 0) : ""}`;
});

const customFormat2 = printf(({ level, message, timestamp, context = "Application", ...meta }) => {
  const coloredTimestamp = colors.gray(`[${timestamp}]`);
  const logLevel = logLevelColor[level];
  const coloredLevel = (colors[logLevel] as (str: string) => string)(`[${level.toUpperCase()}]`);
  const coloredMessage = colors.greenBright(message);
  const coloredContext = colors.yellow(`[${context}]`);

  return `- ${coloredTimestamp} ${coloredContext} ${coloredLevel}: ${coloredMessage} ${Object.keys(meta).length ? JSON.stringify(meta, null, 4) : ""}`;
});

export class Logger {
  private readonly logger: WinstonLogger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat1),
      transports: [
        new winston.transports.File({
          filename: "logs/combined.log",
          handleExceptions: true,
        }),
        new winston.transports.File({
          level: "error",
          filename: "logs/error.log",
          handleExceptions: true,
        }),
      ],
      exitOnError: false,
    });

    this.logger.add(
      new winston.transports.Console({
        level: "debug",
        format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat2),
        handleExceptions: true,
      }),
    );
  }

  info(message: string, context = "Application", ...data: any[]) {
    this.logger.info({ message, context, ...data });
  }

  error(message: string, trace?: any, context = "Application") {
    this.logger.error({ message, trace, context });
  }

  warn(message: string, context = "Application", ...optionalParams: any[]) {
    this.logger.warn({ message, context, ...optionalParams });
  }

  debug(message: string, context = "Application", ...optionalParams: any[]) {
    this.logger.debug({ message, context, ...optionalParams });
  }

  verbose(message: string, context = "Application", ...optionalParams: any[]) {
    this.logger.verbose({ message, context, ...optionalParams });
  }
}
