try {
  require('dotenv').config();
}
catch (e) {
  console.error('DOTENV initialization failed');
}

import * as express from 'express';
import * as cors from 'cors';
import './mongoose-models/index';

import {ApolloServer} from 'apollo-server-express';
import {schema} from './graphql/schema';

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const expressApp = express();
expressApp.use('*', cors({origin: 'http://localhost:4200'}));

const apolloServer = new ApolloServer({schema});
apolloServer.applyMiddleware({app: expressApp});

expressApp.listen(SERVER_PORT, () =>
  console.log(`Apollo GraphQL Server is now running on http://localhost:${SERVER_PORT}`),
);
