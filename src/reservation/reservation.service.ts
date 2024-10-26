import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Repository } from 'typeorm';
import { Seat } from '../seat/seat.entity';
import { ReservedSeat } from '../reservedSeat/reservedSeat.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly seatRepository: Repository<Seat>,
    private readonly reservedSeatRepository: Repository<ReservedSeat>
  ) {}
  // 선착순 예매
  create(createReservationDto: CreateReservationDto) {

  }

  findAll() {
    return `This action returns all reservation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
