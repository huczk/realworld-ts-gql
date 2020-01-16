import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Info,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { IGraphQLToolsResolveInfo } from "apollo-server-express";
import { ApolloError } from "apollo-server-core";
import bcrypt from "bcrypt";

import { getProfileRelations } from "./Profile";
import { Profile, User } from "../entity";
import { isAuth } from "../middleware/isAuth";
import { IContext } from "../types";
import { createToken } from "../auth";

@InputType()
class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
class RegisterInput extends LoginInput {
  @Field()
  username: string;
}

@InputType()
class UpdateInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  image?: string;
}

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("input") { email, password, username }: RegisterInput,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<User | undefined> {
    const existingProfile = await Profile.findOne({ email });

    if (existingProfile) {
      throw new ApolloError("Email already in use");
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await Profile.create({
        email,
        username,
        password: hashedPassword,
      }).save();

      return Profile.findOne(user.id, { relations: getProfileRelations(info) });
    } catch (e) {
      throw new ApolloError(e.message);
    }
  }

  @Mutation(() => User)
  async login(
    @Arg("input") { email, password }: LoginInput,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<User> {
    const user = await Profile.findOne({
      where: { email },
      relations: getProfileRelations(info),
    });

    if (!user) {
      throw new ApolloError("Invalid login data");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new ApolloError("Invalid login data");
    }

    return user;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async updateProfile(
    @Arg("input") { email, password, username, image, bio }: UpdateInput,
    @Ctx() { user }: IContext,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<User | undefined> {
    try {
      const hashedPassword = password && (await bcrypt.hash(password, 12));

      await Profile.update(user!.id, {
        ...(email && { email }),
        ...(username && { username }),
        ...(bio && { bio }),
        ...(image && { image }),
        ...(hashedPassword && { password: hashedPassword }),
      });

      return Profile.findOne(user!.id, {
        relations: getProfileRelations(info),
      });
    } catch (e) {
      return;
    }
  }

  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async user(
    @Ctx() ctx: IContext,
    @Info() info: IGraphQLToolsResolveInfo,
  ): Promise<User | undefined> {
    return Profile.findOne(ctx.user!.id, {
      relations: getProfileRelations(info),
    });
  }

  @FieldResolver(() => String)
  token(
    @Root() user: User,
    @Ctx() { user: userCtx, token }: IContext,
  ): string | undefined {
    return userCtx ? token : createToken(user);
  }
}
