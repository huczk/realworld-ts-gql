import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Info,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getRepository } from "typeorm";
import { fieldsList } from "graphql-fields-list";
import { IGraphQLToolsResolveInfo } from "apollo-server-express";

import { ResponseStatus, getRelations, isFieldRequested } from "./shared";
import { Article, Favorite, Follower } from "../entity";
import { isAuth } from "../middleware/isAuth";
import { IContext } from "../types";

type TArticleRelationFields = keyof Pick<Article, "author">;
type TArticleRelationTuple = [TArticleRelationFields, "author"];

const getArticleRelations = getRelations<TArticleRelationTuple>([
  ["author", "author"],
]);

@ArgsType()
class AddArticle {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  body: string;

  @Field(() => [String], { defaultValue: [], nullable: true })
  tagList?: string[];
}

@ArgsType()
class UpdateArticleArgs {
  @Field()
  slug: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  body?: string;
}

@ArgsType()
class PageArgs {
  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset: number;
}

@ArgsType()
class ArticlesArgs extends PageArgs {
  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  favorited?: string;

  @Field({ nullable: true })
  tag?: string;
}

@Resolver(() => Article)
export class ArticleResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Article, { nullable: true })
  async addArticle(
    @Args() { title, description, body, tagList }: AddArticle,
    @Ctx() { user }: IContext,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Article | undefined> {
    const article = await Article.create({
      title,
      description,
      body,
      tagList,
      author: user,
    }).save();

    return Article.findOne(article.id, {
      relations: getArticleRelations(info),
    });
  }

  @Query(() => Article, { nullable: true })
  async article(
    @Arg("slug") slug: string,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Article | undefined> {
    console.log(fieldsList(info));
    return Article.findOne({
      where: { slug },
      relations: getArticleRelations(info),
    });
  }

  @Query(() => [Article], { nullable: "items" })
  async articles(
    @Args() { offset, limit, favorited, author, tag }: ArticlesArgs,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Article[]> {
    const query = getRepository(Article)
      .createQueryBuilder("article")
      .orderBy("article.createdAt", "DESC")
      .offset(offset)
      .limit(limit);

    if (tag) {
      query.where("article.tagList like :tag", { tag: `%${tag}%` });
    }

    if (favorited) {
      query.innerJoinAndSelect(
        "article.favorites",
        "user",
        "user.username = :favorited",
        { favorited },
      );
    }

    if (author) {
      query.innerJoinAndSelect(
        "article.author",
        "author",
        "author.username = :author",
        { author },
      );
    } else if (isFieldRequested("author", info)) {
      query.leftJoinAndSelect("article.author", "author");
    }

    return query.getMany();
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Article, { nullable: true })
  async favorite(
    @Arg("slug") slug: string,
    @Arg("favorite") favorite: boolean,
    @Ctx() { user }: IContext,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Article | undefined> {
    const article = await Article.findOne(
      { slug },
      { relations: getArticleRelations(info) },
    );

    if (!article) {
      return;
    }

    const data = {
      articleId: article.id,
      profileId: user!.id,
    };

    if (!favorite) {
      await Favorite.delete(data);
      article.favoritesCount--;
    } else {
      const alreadyFavorite = await Favorite.findOne(data);

      if (!alreadyFavorite) {
        await Favorite.create(data).save();
        article.favoritesCount++;
      }
    }

    return article;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Article, { nullable: true })
  async updateArticle(
    @Args() { slug, title, description, body }: UpdateArticleArgs,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Article | undefined> {
    const article = await Article.findOne({ slug });

    if (!article) {
      return;
    }

    try {
      let updatedArticle;

      if (title) {
        updatedArticle = new Article();
        updatedArticle.title = title;
        updatedArticle.setSlug();
      }

      await Article.update(article.id, {
        ...updatedArticle,
        ...(description && { description }),
        ...(body && { body }),
      });

      return Article.findOne(article.id, {
        relations: getArticleRelations(info),
      });
    } catch (e) {
      return;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => ResponseStatus)
  async deleteArticle(@Arg("slug") slug: string): Promise<ResponseStatus> {
    try {
      await Article.delete({ slug });
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }

  @FieldResolver(() => Boolean)
  async favorited(
    @Ctx() { user }: IContext,
    @Root() article: Article,
  ): Promise<boolean> {
    if (!user) {
      return false;
    }

    const favorited = await Favorite.findOne({
      profileId: user.id,
      articleId: article.id,
    });

    return !!favorited;
  }

  @UseMiddleware(isAuth)
  @Query(() => [Article], { nullable: "items" })
  async feed(
    @Args() { offset, limit }: PageArgs,
    @Ctx() { user }: IContext,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Article[]> {
    const query = getRepository(Article)
      .createQueryBuilder("article")
      .where(
        qb =>
          `article.authorId IN ${qb
            .subQuery()
            .select("follower.followingId")
            .from(Follower, "follower")
            .where("follower.followerId = :id", { id: user!.id })
            .getQuery()}`,
      )
      .offset(offset)
      .limit(limit)
      .orderBy("article.createdAt", "DESC");

    if (isFieldRequested("author", info)) {
      query.innerJoinAndSelect("article.author", "author");
    }

    return query.getMany();
  }

  @Query(() => [String], { nullable: "items" })
  async tags(): Promise<string[]> {
    return getRepository(Article)
      .createQueryBuilder("article")
      .getMany()
      .then(articles => [
        ...new Set(articles.map(article => article.tagList).flat()),
      ]);
  }
}
