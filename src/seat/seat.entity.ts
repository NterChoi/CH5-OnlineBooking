import { Column, Entity, FindOperator, FindOperators, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Grade } from './seatGrade.type';
import { Box } from '../box/box.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { ReservedSeat } from '../reservedSeat/reservedSeat.entity';

@Entity({
  name: 'seats',
})
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Grade, nullable: false })
  grade: Grade;

  @Column({ type: 'int', nullable: false })
  seatNumber: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'boolean', nullable: false , default: false})
  isReserved: boolean;

  @ManyToOne(() => Box, (box) => box.seat)
  box: Box;

  @ManyToOne(() => Schedule, (schedule) => schedule.seat)
  schedule: Schedule;

  @OneToMany(() => ReservedSeat, (reservedSeat) => reservedSeat.seat)
  reservedSeat: ReservedSeat;
}