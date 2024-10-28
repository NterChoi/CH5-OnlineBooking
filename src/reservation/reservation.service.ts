import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CreateSelectSeatReservationDto } from './dto/createSelectSeat-reservation.dto';
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

  // 좌석 지정 예매
  async createSelectSeat(createSelectSeatReservationDto: CreateSelectSeatReservationDto, user: User) {
    let totalPrice = 0;
    const schedule = await this.scheduleRepository.findOne(
      {
        where: { id: createSelectSeatReservationDto.scheduleId },
        relations: {
          show: true,
          box: true,
          theater: true,
        },
      });


    if (!schedule) {
      throw new NotFoundException('존재하지 않는 일정입니다 확인해주세요.');
    }
    for (let i = 0; i < createSelectSeatReservationDto.numberOfSpectators; i++) {
      const seat = await this.seatRepository.findOne({
        relations: {
          schedule: true,
        },
        where: {
          schedule: { id: schedule.id },
          seatNumber: createSelectSeatReservationDto.seatNumber[i],
          grade: createSelectSeatReservationDto.grade[i],
        },
      });

      if (seat.isReserved === true) {
        throw new NotFoundException('해당 좌석은 이미 예매된 좌석입니다. 다른 좌석을 예매 해주세요');
      }

      totalPrice += seat.price;
    }

    const queryRunner = this.reservationRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await queryRunner.manager.save(Reservation, {
        user: user,
        schedule: schedule,
        numberOfSpectators: createSelectSeatReservationDto.numberOfSpectators,
        totalPrice: totalPrice,
      });

      for (let i = 0; i < createSelectSeatReservationDto.numberOfSpectators; i++) {
        const seat = await this.seatRepository.findOne({
          relations: {
            schedule: true,
          },
          where: {
            schedule: { id: schedule.id },
            seatNumber: createSelectSeatReservationDto.seatNumber[i],
            grade: createSelectSeatReservationDto.grade[i],
          },
        });

        seat.isReserved = true;
        await queryRunner.manager.save(Seat, seat);
        await queryRunner.manager.save(ReservedSeat, {
          reservation: reservation,
          seat: seat,
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

  async findAll(user: User) {
    return await this.reservationRepository.find({
      select: {
        id: true,
        numberOfSpectators: true,
        totalPrice: true,
        createdAt: true,
        reservedSeat: {
          id: true,
          seat: {
            id: true,
            grade: true,
            seatNumber: true,
          },
        },
      },
      relations: {
        schedule: true,
        reservedSeat: { seat: true },
      },
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        createdAt: 'desc',
      },
    });
  }


  async remove(id: number, user: User) {
    const reservation = await this.reservationRepository.findOne({
      relations: {
        reservedSeat: { seat: true },
        schedule: { show: true },
      },
      where: {
        id: id,
      },
    });
    if (!reservation) {
      throw new NotFoundException('해당하는 예매 내역이 존재하지 않습니다. 확인해주세요');
    }

    const showTime = reservation.schedule.showTime;
    const now = new Date();
    const timeDiff = showTime.getTime() - now.getTime();
    if (timeDiff < 10800) {
      throw new BadRequestException('공연 시간 3시간전까지만 예매 취소가 가능합니다');
    }

    const queryRunner = this.reservationRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.softDelete(Reservation, { id: id });
      await queryRunner.manager.softDelete(ReservedSeat, {
        id: reservation.reservedSeat.id,
      });

      for (let i = 0; i < reservation.numberOfSpectators; i++) {
        const seatId = reservation.reservedSeat[i].seat.id;
        const seat = await this.seatRepository.findOne({
          where: {
            id: seatId,
          },
        });
        seat.isReserved = false;
        await queryRunner.manager.save(Seat, seat);
      }

      await queryRunner.manager.save(Point, {
        user: user,
        value: reservation.totalPrice,
        description: `${reservation.schedule.show.name} 예매 취소로 인한 포인트 환급`,
      });

      await queryRunner.commitTransaction();
      return '예매가 취소 되었습니다.';
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
