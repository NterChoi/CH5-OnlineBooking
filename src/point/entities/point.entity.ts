import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({
  name: 'points',
})
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  value: number;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @CreateDateColumn({name : 'created_at', type: 'timestamp'})
  createdAt : Date;

  @ManyToOne(() => User, (user) => user.point)
  user: User;
}
