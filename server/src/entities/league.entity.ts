import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { DraftPick } from './draft-pick.entity';

export enum ScoringType {
  PPR = 'ppr',
  HALF_PPR = 'half_ppr',
  STANDARD = 'standard',
}

@Entity('leagues')
export class League {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true })
  sleeperId!: string;

  @Column()
  name!: string;

  @Column()
  season!: string;

  @Column()
  status!: string;

  @Column({ type: 'enum', enum: ScoringType, default: ScoringType.STANDARD })
  scoringType!: ScoringType;

  @Column()
  totalRosters!: number;

  @Column({ nullable: true })
  draftId!: string;

  @ManyToMany(() => User, (user) => user.leagues)
  users!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => DraftPick, (pick) => pick.league)
  picks!: DraftPick[];
}
