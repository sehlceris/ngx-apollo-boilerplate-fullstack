import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

export const userSchema = makeExecutableSchema({
  typeDefs: `
    type User {
      id: ID!
      username: String!
      email: String!
      hashedPassword: String!
      firstName: String
      lastName: String
    }

    type Query {
      userById(id: ID!): User
      userByUsername(username: String!): User
    }
    
    type Mutation {
      createUser(
        username: String!
        email: String!
        password: String!
        firstName: String
        lastName: String
      ): User
      updateUserById(
        id: ID!
        username: String
        email: String
        password: String
        firstName: String
        lastName: String
      ): User
    }
  `
});

addMockFunctionsToSchema({ schema: userSchema, preserveResolvers: true });
