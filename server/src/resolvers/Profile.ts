import {
  Arg,
  Ctx,
  FieldResolver,
  Info,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { IGraphQLToolsResolveInfo } from "apollo-server-express";

import { getRelations } from "./shared";
import { Follower, Profile } from "../entity";
import { isAuth } from "../middleware/isAuth";
import { IContext } from "../types";

type TArticleRelationFields = keyof Pick<Profile, "articles">;
type TArticleRelationTuple = [TArticleRelationFields, "articles"];

export const getProfileRelations = getRelations<TArticleRelationTuple>([
  ["articles", "articles"],
]);

@Resolver(() => Profile)
export class ProfileResolver {
  @Query(() => Profile, { nullable: true })
  async profile(
    @Arg("username") username: string,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Profile | undefined> {
    return Profile.findOne({
      where: { username },
      relations: getProfileRelations(info),
    });
  }

  @FieldResolver(() => Boolean)
  async following(
    @Ctx() ctx: IContext,
    @Root() user?: Profile,
  ): Promise<boolean> {
    if (!ctx.user || !user) {
      return false;
    }

    const following = await Follower.findOne({
      followerId: ctx.user.id,
      followingId: user.id,
    });

    return !!following;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Profile, { nullable: true })
  async follow(
    @Arg("username") username: string,
    @Arg("follow") follow: boolean,
    @Ctx() { user }: IContext,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<Profile | undefined> {
    const userToFollow = await Profile.findOne({
      where: { username },
      relations: getProfileRelations(info),
    });

    if (!user || !userToFollow) {
      return;
    }

    const data = {
      followerId: user.id,
      followingId: userToFollow.id,
    };

    if (!follow) {
      await Follower.delete(data);
    } else {
      const alreadyFollow = await Follower.findOne(data);

      if (!alreadyFollow) {
        await Follower.create(data).save();
      }
    }

    return userToFollow;
  }
}
