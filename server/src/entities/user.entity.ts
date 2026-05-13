import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { League } from './league.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true })
  sleeperId!: string;

  @Column()
  username!: string;

  @Column()
  displayName!: string;

  @Column({ nullable: true })
  avatar!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToMany(() => League, (league) => league.users)
  @JoinTable({ name: 'user_leagues' })
  leagues!: League[];
}
