let currentId = 2;
let getMockId = function() {
  currentId++;
  return String(currentId);
};
const mockUsers = [
  {
    id: '1',
    username: 'sehlceris',
    emailAddress: 'sehlceris@example.com',
    hashedPassword: 'e89cw9w9rc',
    firstName: 'Chris',
    lastName: 'Lee',
  },
  {
    id: '2',
    username: 'user',
    emailAddress: 'user@example.com',
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
  Mutation: {
    createUser(obj, args, context, info) {
      args = {...args};
      const plainTextPasswordUnsafe = args.password;
      delete args.password;
      const newUser = {
        ...args,
        hashedPassword: 'fake-hashed-password-' + plainTextPasswordUnsafe,
        id: getMockId(),
      };
      mockUsers.push(newUser);
      return newUser;
    },
    updateUserById(obj, args, context, info) {
      const foundUser = mockUsers.find((user) => user.id === args.id);
      if (foundUser) {
        args = {...args};
        const plainTextPasswordUnsafe = args.password;
        delete args.password;
        foundUser.hashedPassword = 'fake-hashed-password-' + plainTextPasswordUnsafe;
        Object.keys(args).forEach((argName) => {
          foundUser[argName] = args[argName];
        });
        return foundUser;
      }
      throw new Error(`could not find user with id ${args.id}`);
    },
  },
  User: {
  },
};
