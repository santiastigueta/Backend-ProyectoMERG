import { ApolloServer } from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import conectarDB from './config/db.js';
import dotenv from 'dotenv';
import seriesResolvers from './resolvers/series.resolver.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();
conectarDB();
const __filename = fileURLToPath(
    import.meta.url);

const port = process.env.PORT || 3000;
const __dirname = path.dirname(__filename);
const app = express();
const httpServer = http.createServer(app);


const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, './graphql/series.graphql'),
        'utf8'
    ),
    resolvers: seriesResolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
});
await server.start();
server.applyMiddleware({ app });
await new Promise(resolve => httpServer.listen({ port }, resolve));
console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);