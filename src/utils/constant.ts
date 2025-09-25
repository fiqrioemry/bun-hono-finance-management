const constant = {
  // cloudinary config
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

  //   database config
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL!,

  //   server config
  SERVER_PORT: process.env.SERVER_PORT!,
  SERVER_URL: process.env.SERVER_URL!,
  CLIENT_URL: process.env.CLIENT_URL!,
  NODE_ENV: process.env.NODE_ENV!,
  APP_NAME: process.env.APP_NAME!,

  // jwt secrets
  ACCESS_SECRET: process.env.ACCESS_SECRET!,
  REFRESH_SECRET: process.env.REFRESH_SECRET!,
  ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN!,
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN!,

  // mailer config
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PORT: process.env.SMTP_PORT!,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PASS: process.env.SMTP_PASS!,
};

export default constant;
