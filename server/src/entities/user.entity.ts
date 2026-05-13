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
  email!: string;

  @Column()
  passwordHash!: string;

  @Index()
  @Column({ unique: true, nullable: true })
  sleeperId!: string;

  @Column({ nullable: true })
  username!: string;

  @Column({ nullable: true })
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
