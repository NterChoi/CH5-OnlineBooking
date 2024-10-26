import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from '../reservation/entities/reservation.entity';
import { Seat } from '../seat/seat.entity';

@Entity({
  name: 'reservedSeats'
})
export class ReservedSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.reservedSeat)
  reservation: Reservation;

  @ManyToOne(()=> Seat, (seat)=> seat.reservedSeat)
  seat : Seat;
}