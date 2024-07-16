const ENV = Object.freeze({
  NODE_ENV: process.env.NODE_ENV as string,
  PORT: process.env.PORT as string,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_TOKEN_EXPIRE: process.env.JWT_TOKEN_EXPIRE as string,
  UPLOADS_FOLDERS: process.env.UPLOADS_FOLDERS as string,
});

export default ENV;
