import * as mongoose from 'mongoose';
import {UserModel} from './user';
import {TaskModel} from './task';

const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;
const databaseName = process.env.DATABASE_NAME;

const databaseUri = `mongodb://${username}:${password}@${host}:${port}/${databaseName}`;

console.log(`connecting to ${databaseUri}`);
mongoose.connect(databaseUri, {
  keepAlive: 30000,
  reconnectTries: Number.MAX_VALUE,
});

export {UserModel, TaskModel};
