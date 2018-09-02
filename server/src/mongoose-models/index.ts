import * as mongoose from 'mongoose';

const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbHost = process.env.DATABASE_HOST;
const dbPort = process.env.DATABASE_PORT;
const dbName = process.env.DATABASE_NAME;
const dbAuthSource = process.env.DATABASE_AUTH_SOURCE;

const databaseUri = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=${dbAuthSource}`;

console.log(`connecting to ${databaseUri}`);
mongoose.connect(databaseUri, {
  useNewUrlParser: true,
  keepAlive: 30000,
  reconnectTries: Number.MAX_VALUE,
})
.then((val) => console.log('mongoose connected', val))
.catch((err) => console.log('mongoose FAILED to connect', err));
