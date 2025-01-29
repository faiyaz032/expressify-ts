export default {
  port: process.env.PORT || 6969,
  databaseUrl: process.env.DATABASE || 'From development file',
  environment: 'production',
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
