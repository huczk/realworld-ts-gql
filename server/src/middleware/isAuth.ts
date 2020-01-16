import { ApolloError } from "apollo-server-core";
import { MiddlewareFn } from "type-graphql";

import { IContext } from "../types";

export const isAuth: MiddlewareFn<IContext> = async ({ context }, next) => {
  if (!context.user?.id) {
    throw new ApolloError("not authenticated");
  }

  return next();
};
