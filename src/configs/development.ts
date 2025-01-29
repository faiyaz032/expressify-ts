export default {
  port: 8080,
  databaseUrl: process.env.DATABASE || 'From development file',
  environment: 'development',
  jwtSecretKey: process.env.JWT_SECRET_KEY,

  logger: {
    level: process.env.LOG_LEVEL || 'info',
    logDirectory: 'logs',
    maxFileSize: '20m',
    maxFiles: '14d',
    datePattern: 'YYYY-MM-DD',
    environment: process.env.NODE_ENV || 'development',
  },
};
