import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Player } from './player.entity';
import { League } from './league.entity';

@Entity('draft_picks')
export class DraftPick {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  draftId!: string;

  @Column()
  round!: number;

  @Column()
  pickNumber!: number;

  @Column()
  pickedBy!: string;

  @Column({ type: 'varchar', nullable: true, name: 'sleeper_player_id' })
  sleeperPlayerId!: string | null;

  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'player_id' })
  player!: Player | null;

  @ManyToOne(() => League, (league) => league.picks)
  @JoinColumn({ name: 'league_id' })
  league!: League;

  @CreateDateColumn()
  createdAt!: Date;
}
