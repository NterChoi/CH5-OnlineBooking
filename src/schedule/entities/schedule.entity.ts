import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Show } from '../../show/entities/show.entity';
import { Theater } from '../../theater/theater.entity';
import { Box } from '../../box/box.entity';
import { Seat } from '../../seat/seat.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity({
  name: 'schedules',
})
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Show, (show) => show.schedule)
  show: Show

  @ManyToOne(() => Theater, (theater) => theater.schedule)
  theater: Theater

  @ManyToOne(() => Box, (box) => box.schedule)
  box: Box


  @Column({type: 'timestamp', nullable: false})
  showTime: Date;

  @OneToMany(() => Seat, (seat) => seat.schedule)
  seat: Seat;

  @OneToMany(() => Reservation, (reservation) => reservation.schedule)
  reservation: Reservation;
}
