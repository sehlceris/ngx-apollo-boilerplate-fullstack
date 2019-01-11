export enum Configuration {
  // ips and ports of stuff
  SERVER_HOST = 'SERVER_HOST',
  SERVER_PORT = 'SERVER_PORT',
  CLIENT_ROOT = 'CLIENT_ROOT',
  CLIENT_PORT = 'CLIENT_PORT',

  // database stuff
  MONGODB_HOST = 'MONGODB_HOST',
  MONGODB_PORT = 'MONGODB_PORT',
  MONGODB_USERNAME = 'MONGODB_USERNAME',
  MONGODB_PASSWORD = 'MONGODB_PASSWORD',
  MONGODB_DATABASE_NAME = 'MONGODB_DATABASE_NAME',
  MONGODB_AUTH_SOURCE = 'MONGODB_AUTH_SOURCE',

  // redis
  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASSWORD = 'REDIS_PASSWORD',

  // email
  EMAIL_FROM_ADDRESS = 'EMAIL_FROM_ADDRESS',
  EMAIL_SMTP_HOST = 'EMAIL_SMTP_HOST',
  EMAIL_SMTP_PORT = 'EMAIL_SMTP_PORT',
  EMAIL_SMTP_USERNAME = 'EMAIL_SMTP_USERNAME',
  EMAIL_SMTP_PASSWORD = 'EMAIL_SMTP_PASSWORD',

  // JWT
  JWT_AUTH_TOKEN_EXPIRATION = 'JWT_AUTH_TOKEN_EXPIRATION',
  JWT_VERIFY_EMAIL_TOKEN_EXPIRATION = 'JWT_VERIFY_EMAIL_TOKEN_EXPIRATION',
  JWT_EMAIL_TOKEN_EXPIRATION = 'JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION',

  // public key of auth server, flatted into a single line with linebreaks replaced with '\n' and wrapped in quotes, like so: "-----BEGIN PUBLIC KEY-----\nMFww..."
  AUTH_SERVER_PUBLIC_KEY = 'AUTH_SERVER_PUBLIC_KEY', // auth server's public key

  // private key of auth server in PKCS#1 format, flatted into a single line with linebreaks replaced with '\n' and wrapped in quotes, like so: "-----BEGIN PUBLIC KEY-----\nMFww..."
  AUTH_SERVER_PRIVATE_KEY = 'AUTH_SERVER_PRIVATE_KEY', // auth server's private key


  // secrets (TODO: deprecated, remove)
  JWT_SECRET_KEY = 'JWT_SECRET_KEY',
}
