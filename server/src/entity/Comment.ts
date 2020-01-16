import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { Profile } from "./Users";
import { Article } from "./Article";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Field()
  @Column()
  body: string;

  @Column()
  authorId: number;

  @Field(() => Profile)
  @ManyToOne(() => Profile)
  @JoinColumn({ name: "authorId" })
  author: Profile;

  @Column()
  articleId: number;

  @Field(() => Article)
  @ManyToOne(() => Article)
  @JoinColumn({ name: "articleId" })
  article: Article;
}
