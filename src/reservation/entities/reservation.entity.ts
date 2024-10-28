import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { ReservedSeat } from '../../reservedSeat/reservedSeat.entity';
import { User } from '../../user/entities/user.entity';

@Entity({
  name: 'reservations' }
)
export class Reservation {
  @PrimaryGeneratedColumn()
  id : number;

  @Column({ type: 'int', nullable: false })
  numberOfSpectators: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.reservation)
  schedule: Schedule;

  @OneToMany(() => ReservedSeat, (reservedSeat) => reservedSeat.reservation)
  reservedSeat: ReservedSeat;

  @ManyToOne(()=> User, (user)=> user.reservation)
  user: User

  @Column({ type: 'int', nullable: false })
  totalPrice: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
