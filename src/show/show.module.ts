import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Show,Schedule]),
  ],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
