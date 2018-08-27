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
      allTasks: [Task]
      taskById(id: ID!): Task
      taskByUserId(userId: ID!): [Task]
    }

    type Mutation {
      addTask(name: String!, description: String): Task
      deleteTaskById(id: ID!): Task
      updateTaskById(id: ID!, name: String, description: String, done: Boolean): Task
      markTaskAsDoneById(id: ID!): Task
    }
  `
});

addMockFunctionsToSchema({ schema: taskSchema, preserveResolvers: true });
