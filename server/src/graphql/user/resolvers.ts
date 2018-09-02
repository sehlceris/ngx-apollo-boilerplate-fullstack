import {User, UserModel} from '../../mongoose-models/user';
import * as bcrypt from 'bcrypt';

let currentId = 2;

let getMockId = function() {

  currentId++;
  return String(currentId);
};

export const userResolvers = {
  Query: {
    async userById(obj, args, context, info) {
      return UserModel.findById(args.id);
    },
    async userByUsername(obj, args, context, info) {
      return UserModel.find({
        username: args.username
      });
    },
  },
  Mutation: {
    async createUser(obj, args, context, info) {
      args = {...args};
      const plainTextPasswordUnsafe = args.password;
      delete args.password;
      const newUser = {
        ...args,
        hashedPassword: await bcrypt.hash(plainTextPasswordUnsafe, 10),
      };
      const document = new UserModel({
        ...newUser,
      });
      console.log('trying to create a user: ', newUser, document);
      let doc;
      try {
        doc = await document.save();
      }
      catch(e) {
        console.log('fail');
        console.log(e);
      }
      console.log('saved doc', doc);
      return doc;
    },
    async updateUserById(obj, args, context, info) {
      // const foundUser = mockUsers.find((user) => user.id === args.id);
      // if (foundUser) {
      //   args = {...args};
      //   const plainTextPasswordUnsafe = args.password;
      //   delete args.password;
      //   foundUser.hashedPassword = 'fake-hashed-password-' + plainTextPasswordUnsafe;
      //   Object.keys(args).forEach((argName) => {
      //     foundUser[argName] = args[argName];
      //   });
      //   return foundUser;
      // }
      // throw new Error(`could not find user with id ${args.id}`);
    },
  },
  User: {
  },
};
