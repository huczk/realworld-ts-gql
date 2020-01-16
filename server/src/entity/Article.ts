import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationCount,
  UpdateDateColumn,
} from "typeorm";
import { Field, ID, Int, ObjectType } from "type-graphql";
import slug from "slug";

import { Profile } from "./Users";

@ObjectType()
@Entity()
export class Article extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Field()
  @Column()
  slug: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ default: "" })
  description: string;

  @Field()
  @Column({ default: "" })
  body: string;

  @Field(() => [String], { nullable: "items" })
  @Column("simple-array")
  tagList: string[];

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToMany(() => Profile)
  @JoinTable({ name: "favorite" })
  favorites: Profile[];

  @Field(() => Int)
  @RelationCount("favorites")
  favoritesCount: number;

  @Field(() => Profile)
  @ManyToOne(() => Profile)
  author: Profile;

  @Field()
  favorited: boolean;

  @BeforeUpdate()
  @BeforeInsert()
  setSlug(): void {
    this.slug = slug(this.title, { lower: true, replacement: "-" });
  }
}
