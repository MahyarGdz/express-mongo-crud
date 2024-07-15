declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;

    MONGO_URI: string;

    JWT_SECRET: string;
    JWT_TOKEN_EXPIRE: string;

    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
  }
}
