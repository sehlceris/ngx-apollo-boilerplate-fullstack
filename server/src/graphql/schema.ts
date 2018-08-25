import {
  mergeSchemas,
} from 'graphql-tools';
import {taskSchema} from './task/schema';
import {userSchema} from './user/schema';

export const schema = mergeSchemas({
  schemas: [
    userSchema,
    taskSchema,
  ],
});
