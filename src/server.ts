import mongoose from "mongoose";
import { config } from "dotenv";
config();
import { Application } from "./app";
import ENV from "./config/env.config";
import { Logger } from "./logging/logger";

const logger = new Logger();
async function bootStrap() {
  try {
    //connect to mongodb before start the application
    await mongoose.connect(ENV.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    logger.info("connected to mongodb", "Database");
    //
    Application.listen(ENV.PORT, () => {
      logger.info(`server is start and listen on http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    logger.error("Error starting the server.", error);
  }
}

bootStrap();
