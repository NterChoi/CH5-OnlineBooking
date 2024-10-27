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
    private readonly reservationRepository: Repository<Reservation>,
  ) {
  }

  // 선착순 입장 예매
  async create(createReservationDto: CreateReservationDto, user: User) {
    let totalPrice = 0;
    const schedule = await this.scheduleRepository.findOne(
      {
        where: { id: createReservationDto.scheduleId },
        relations: {
          show: true,
          box: true,
          theater: true,
        },
      });

    console.log(schedule);
    if (!schedule) {
      throw new NotFoundException('존재하지 않는 일정입니다 확인해주세요.');
    }

    const seats = await this.seatRepository.find({
      relations: {
        schedule: true,
      },
      where: {
        schedule: { id: schedule.id },
        isReserved: false,
      },
    });
    console.log(seats);

    if (seats.length === 0) {
      throw new NotFoundException('예매할 수 있는 좌석이 없습니다.');
    }

    for (let i = 0; i < createReservationDto.numberOfSpectators; i++) {
      totalPrice += seats[i].price;
    }

    const queryRunner = this.reservationRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await queryRunner.manager.save(Reservation, {
        user: user,
        schedule: schedule,
        numberOfSpectators: createReservationDto.numberOfSpectators,
        totalPrice: totalPrice,
      });

      for (let i = 0; i < createReservationDto.numberOfSpectators; i++) {
        seats[i].isReserved = true;
        await queryRunner.manager.save(Seat, seats[i]);
        await queryRunner.manager.save(ReservedSeat, {
          reservation: reservation,
          seat: seats[i],
        });
      }

      await queryRunner.manager.save(Point, {
        user: user,
        value: -reservation.totalPrice,
        description: `${schedule.show.name} 예매`,
      });

      await queryRunner.commitTransaction();

      return {
        '공연명': schedule.show.name,
        '극장/상영관': `${schedule.theater.name}/${schedule.box.name}`,
        '관람일시': schedule.showTime,
        '관람인원': reservation.numberOfSpectators,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
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
