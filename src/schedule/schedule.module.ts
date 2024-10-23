import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from '../show/entities/show.entity';
import { Theater } from '../theater/theater.entity';
import { Box } from '../box/box.entity';
import { Schedule } from './entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, Theater, Box, Schedule]),],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
