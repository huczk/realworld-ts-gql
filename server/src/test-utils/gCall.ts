import "reflect-metadata";
import { ExecutionResult, GraphQLSchema, graphql } from "graphql";
import Maybe from "graphql/tsutils/Maybe";

import { buildSchema } from "type-graphql";
import { Resolvers } from "../resolvers";

(async (): Promise<GraphQLSchema> =>
  await buildSchema({
    resolvers: Resolvers,
    emitSchemaFile: {
      path: __dirname + "/schema.gql",
      commentDescriptions: true,
      sortedSchema: false,
    },
  }))();

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

export const gCall = async ({
  source,
  variableValues,
}: Options): Promise<ExecutionResult> => {
  if (!schema) {
    schema = await await buildSchema({
      resolvers: Resolvers,
      emitSchemaFile: false,
    });
  }
  return graphql({
    schema,
    source,
    variableValues,
  });
};
