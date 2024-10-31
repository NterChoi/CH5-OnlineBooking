import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Show } from '../show/entities/show.entity';
import { EntityManager, Repository } from 'typeorm';
import { Theater } from '../theater/theater.entity';
import { Box } from '../box/box.entity';
import { Status } from '../show/type/showStatus.type';
import { Schedule } from './entities/schedule.entity';
import { Seat } from '../seat/seat.entity';
import { Grade } from '../seat/seatGrade.type';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectEntityManager()
    private readonly entityManger: EntityManager,
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {
  }

  async create(createScheduleDto: CreateScheduleDto) {
    const theater = await this.theaterRepository.findOneBy({ id: createScheduleDto.theaterId });
    const box = await this.boxRepository.findOne({
      where: { id: createScheduleDto.boxId },
      relations: {
        theater: true,
      },
    });

    const show = await this.showRepository.findOneBy({ id: createScheduleDto.showId });
    if (!theater) {
      throw new BadRequestException('존재하지 않는 극장입니다 확인해주세요.');
    }
    if (box.theater.id !== theater.id) {
      throw new BadRequestException('극장에 존재하지 않는 상영관입니다 확인해주세요.');
    }
    if (!show || show.status !== Status.Open) {
      throw new BadRequestException('현재 상영 중이지 않는 영화입니다 확인해주세요');
    }

    // const showTime = new Date(createScheduleDto.showTime);
    const now = new Date();
    return await this.entityManger.transaction(async (manager) => {
      for (let i = 0; i < createScheduleDto.showTime.length; i++) {
        if (createScheduleDto.showTime[i] < now) {
          throw new BadRequestException('현재 시간 이후에만 상영 시간 생성이 가능합니다.');
        }

        const isExistSchedule = await this.scheduleRepository.findOne({
          where : {
            box : {id : box.id},
            theater : {id : theater.id},
            showTime : createScheduleDto.showTime[i]
          }
        })

        if (isExistSchedule){
          throw new BadRequestException('이미 해당 상영관에 공연이 예정되있습니다.');
        }

        const schedule= await manager.getRepository(Schedule).save({
          show: show,
          theater: theater,
          box: box,
          showTime: createScheduleDto.showTime[i],
        });
        if(box.goldSeatCount !== 0) {
          for (let i = 1; i <= box.goldSeatCount; i++) {
            await manager.getRepository(Seat).save({
              grade: Grade.Gold,
              seatNumber: i,
              price: 50000,
              box: schedule.box,
              schedule: schedule
            });
          }
        }
        if (box.silverSeatCount !== 0) {
          for (let i = 1; i <= box.silverSeatCount; i++) {
            await manager.getRepository(Seat).save({
              grade: Grade.Silver,
              seatNumber: i,
              price: 40000,
              box: schedule.box,
              schedule: schedule
            })
          }
        }
        for(let i = 1; i <= box.bronzeSeatCount; i++){
          await manager.getRepository(Seat).save({
            grade: Grade.Bronze,
            seatNumber: i,
            price: 40000,
            box: schedule.box,
            schedule: schedule
          })
        }
      }
    });
  }
}
