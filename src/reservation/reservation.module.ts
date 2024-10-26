import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from '../show/entities/show.entity';
import { Theater } from '../theater/theater.entity';
import { Box } from '../box/box.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Seat } from '../seat/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, Theater, Box, Schedule, Seat]),],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
