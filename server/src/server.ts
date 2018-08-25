try {
  require('dotenv').config();
}
catch (e) {
  console.error('DOTENV initialization failed');
}

import * as express from 'express';
import * as cors from 'cors';

import {ApolloServer} from 'apollo-server-express';
import {schema} from './graphql/schema';

const PORT = process.env.PORT || 3000;

const expressApp = express();
expressApp.use('*', cors({origin: 'http://localhost:4200'}));

const apolloServer = new ApolloServer({schema});
apolloServer.applyMiddleware({app: expressApp});

expressApp.listen(PORT, () =>
  console.log(`Apollo GraphQL Server is now running on http://localhost:${PORT}`),
);
