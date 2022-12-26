import { ApolloServer } from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';

import dotenv from 'dotenv';

import authenticate from './middlewares/auth.js';

//resolvers
import seriesResolvers from './resolvers/series.resolver.js';
import userResolver from './resolvers/user.resolver.js';


import mongoDb from './config/db.js'; // MONGODB
import { mergeResolvers } from '@graphql-tools/merge';


dotenv.config();


const port = process.env.PORT || 3000;
const app = express();
app.use(authenticate)
const httpServer = http.createServer(app);

import typesArray from './utils/typeDefs.js';
const resolvers = mergeResolvers([seriesResolvers, userResolver]);
const server = new ApolloServer({
    typeDefs: typesArray,
    resolvers: resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
});
mongoDb();
await server.start();
server.applyMiddleware({ app });
new Promise(resolve => httpServer.listen({ port }, resolve));
console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);