import {
  Arg,
  Ctx,
  Info,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { IGraphQLToolsResolveInfo } from "apollo-server-express";

import { ResponseStatus, getRelations } from "./shared";
import { Article, Comment } from "../entity";
import { isAuth } from "../middleware";
import { IContext } from "../types";

type TCommentRelationFields = keyof Pick<Comment, "article" | "author">;
type TCommentRelationTuple = [TCommentRelationFields, "article" | "author"];

const getCommentRelations = getRelations<TCommentRelationTuple>([
  ["article", "article"],
  ["author", "author"],
]);

@Resolver(() => Comment)
export class CommentResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Comment, { nullable: true })
  async addComment(
    @Arg("slug") slug: string,
    @Arg("body") body: string,
    @Ctx() { user }: IContext,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Comment | undefined> {
    const article = await Article.findOne({ slug });

    if (!article) {
      return;
    }

    const comment = await Comment.create({
      body,
      authorId: user!.id,
      articleId: article.id,
    }).save();

    return Comment.findOne(comment.id, {
      relations: getCommentRelations(info),
    });
  }

  @Query(() => [Comment], { nullable: "items" })
  async comments(
    @Arg("slug") slug: string,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Comment[]> {
    const article = await Article.findOne({ slug });

    return article
      ? Comment.find({
          where: { articleId: article.id },
          relations: getCommentRelations(info),
        })
      : [];
  }

  @UseMiddleware(isAuth)
  @Mutation(() => ResponseStatus)
  async deleteComment(@Arg("id") id: number): Promise<ResponseStatus> {
    try {
      await Comment.delete(id);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }
}
