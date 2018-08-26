import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

export const taskSchema = makeExecutableSchema({
  typeDefs: `
    type Task {
      id: ID!
      userId: ID!
      name: String!
      description: String
      done: Boolean
    }

    type Query {
      taskById(id: ID!): Task
      taskByUserId(userId: ID!): [Task]
    }
  `
});

addMockFunctionsToSchema({ schema: taskSchema, preserveResolvers: true });
