import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { Resolvers } from "./resolvers";

(async (): Promise<GraphQLSchema> =>
  await buildSchema({
    resolvers: Resolvers,
    emitSchemaFile: {
      path: __dirname + "/schema.gql",
      commentDescriptions: true,
      sortedSchema: false,
    },
  }))();
