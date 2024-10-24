import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Grade } from './seatGrade.type';

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

  @Column({ type: 'number', nullable: false })
  price: number;

  @Column({ type: 'boolean', nullable: false , default: false})
  isReserved: boolean;

}