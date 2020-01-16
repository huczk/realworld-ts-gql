import { BuildSchemaOptions } from "type-graphql";

import { UserResolver } from "./User";
import { ProfileResolver } from "./Profile";
import { ArticleResolver } from "./Article";
import { CommentResolver } from "./Comment";

export const Resolvers: BuildSchemaOptions["resolvers"] = [
  UserResolver,
  ProfileResolver,
  ArticleResolver,
  CommentResolver,
];
