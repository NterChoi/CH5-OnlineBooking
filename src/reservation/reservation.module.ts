import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from '../show/entities/show.entity';
import { Theater } from '../theater/theater.entity';
import { Box } from '../box/box.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Seat } from '../seat/seat.entity';
import { ReservedSeat } from '../reservedSeat/reservedSeat.entity';
import { Point } from '../point/entities/point.entity';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Seat, ReservedSeat, Point, Reservation]),],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
