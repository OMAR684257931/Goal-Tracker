import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Goal } from '../../../goals/entities/goal/goal';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  @OneToMany(() => Goal, (goal) => goal.owner)
  goals: Goal[];
}
