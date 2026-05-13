import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true })
  sleeperId!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  position!: string;

  @Column({ nullable: true })
  team!: string;

  @Column({ nullable: true })
  status!: string;

  @Column({ type: 'float', nullable: true })
  adp!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
