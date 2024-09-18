export default {
  databaseUrl: process.env.DATABASE || 'From development file',
  environment: 'development',
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
