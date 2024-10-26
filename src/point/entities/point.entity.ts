import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.point)
  user: User;
}
