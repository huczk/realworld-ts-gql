import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { Resolvers } from "./resolvers";
import { connectDB } from "./connectDB";
import { IContext } from "./types";
import { getContext } from "./auth";

(async (): Promise<void> => {
  await connectDB();

  const app = express();

  app.use(
    cors({
      origin: "*",
      methods: "POST",
      exposedHeaders: ["Authorization"],
      allowedHeaders: ["Authorization", "Content-Type", "Origin", "Accept"],
    }),
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: Resolvers,
      validate: false,
      dateScalarMode: "isoDate",
    }),
    context: ({ req }): IContext => getContext(req),
    playground: {
      settings: {
        "request.credentials": "include",
      },
    },
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT, () => {
    console.log(
      `🚀 server started at http://localhost:${process.env.PORT}/graphql`,
    );
  });
})();
