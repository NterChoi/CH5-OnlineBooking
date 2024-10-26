import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Repository } from 'typeorm';
import { Seat } from '../seat/seat.entity';
import { ReservedSeat } from '../reservedSeat/reservedSeat.entity';
import { Point } from '../point/entities/point.entity';
import { Reservation } from './entities/reservation.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(ReservedSeat)
    private readonly reservedSeatRepository: Repository<ReservedSeat>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>
  ) {}
  // 선착순 예매
  async create(createReservationDto: CreateReservationDto, user : User) {
    const schedule = await this.scheduleRepository.findOneBy({ id: createReservationDto.scheduleId });
    if (!schedule) {
      throw new NotFoundException('존재하지 않는 일정입니다 확인해주세요.');
    }

    const seats = await this.seatRepository.findBy({
      schedule: schedule,
      isReserved: false,
    });

    if (!seats) {
      throw new NotFoundException('예매할 수 있는 좌석이 없습니다.')
    }

    const reservation = await this.reservationRepository.save({
      user: user,
      schedule: schedule,
      numberOfSpectators: createReservationDto.numberOfSpectators,
    });

    for(let i =0 ; i < createReservationDto.numberOfSpectators; i++){
      seats[i].isReserved = true
      await this.seatRepository.save(seats[i]);
      await this.reservedSeatRepository.save({
        reservation: reservation,
        seat: seats[i],
      });
    }



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
