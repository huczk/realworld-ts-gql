import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Profile } from "./Users";

@Entity()
export class Follower extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: true })
  followerId: number;

  @Column({ nullable: true })
  followingId: number;

  @ManyToOne(() => Profile)
  follower: Profile;

  @ManyToOne(() => Profile)
  following: Profile;
}
