const mockUsers = [
  {
    id: '1',
    username: 'sehlceris',
    hashedPassword: 'e89cw9w9rc',
    firstName: 'Chris',
    lastName: 'Lee',
  },
  {
    id: '2',
    username: 'user',
    hashedPassword: 'cmeiwfghe8',
    firstName: 'Ussey',
    lastName: 'McUsserson',
  },
];

export const userResolvers = {
  Query: {
    userById(obj, args, context, info) {
      return mockUsers.find((user) => user.id === args.id);
    },
    userByUsername(obj, args, context, info) {
      return mockUsers.find((user) => user.username === args.username);
    }
  },
  User: {
  }
};
