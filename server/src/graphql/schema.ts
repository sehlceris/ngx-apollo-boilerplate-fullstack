import {
  mergeSchemas,
} from 'graphql-tools';
import {taskResolvers, taskSchema} from './task';
import {userResolvers, userSchema} from './user';

export const schema = mergeSchemas({
  schemas: [
    userSchema,
    taskSchema,
  ],
  resolvers: [
    userResolvers,
    taskResolvers
  ]
});
