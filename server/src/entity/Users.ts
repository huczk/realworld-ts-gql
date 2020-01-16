import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Article } from "./Article";

@ObjectType()
export class ProfileBase extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column({ default: "" })
  bio: string;

  @Field()
  @Column({ default: "" })
  image: string;

  @Field(() => [Article], { nullable: "items" })
  @OneToMany(
    () => Article,
    ({ author }) => author,
  )
  articles: Article[];
}

@ObjectType()
@Entity()
export class Profile extends ProfileBase {
  @Field()
  following: boolean;
}

@ObjectType()
export class User extends ProfileBase {
  @Field()
  email: string;

  @Field({ nullable: true })
  token?: string;
}
