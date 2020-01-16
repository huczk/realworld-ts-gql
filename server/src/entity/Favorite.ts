import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { Profile } from "./Users";
import { Article } from "./Article";

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryColumn("int")
  profileId: number;

  @PrimaryColumn("int")
  articleId: number;

  @ManyToOne(() => Profile, { primary: true })
  @JoinColumn({ name: "profileId" })
  profile: Profile;

  @ManyToOne(() => Article, { primary: true })
  @JoinColumn({ name: "articleId" })
  article: Article;
}
