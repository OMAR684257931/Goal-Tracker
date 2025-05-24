import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user/user';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  deadline: Date;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToOne(() => Goal, (goal) => goal.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent?: Goal;

  @OneToMany(() => Goal, (goal) => goal.parent)
  children: Goal[];

  @Column({ nullable: true })
  parentId?: string;

  @Column({ nullable: true })
  publicId?: string;

  @Column()
  order: number;

  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  owner: User;

  @Column()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
