import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

export const userSchema = makeExecutableSchema({
  typeDefs: `
    type User {
      id: ID!
      username: String!
      hashedPassword: String!
      firstName: String
      lastName: String
    }

    type Query {
      userById(id: ID!): User
      userByUsername(username: String!): User
    }
  `
});

addMockFunctionsToSchema({ schema: userSchema, preserveResolvers: true });
