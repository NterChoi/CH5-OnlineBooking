import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from '../show/entities/show.entity';
import { Repository } from 'typeorm';
import { Theater } from '../theater/theater.entity';
import { Box } from '../box/box.entity';
import { Status } from '../show/type/showStatus.type';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>,
    @InjectRepository(Schedule)
    private readonly  scheduleRepository: Repository<Schedule>
  ) {
  }

  async create(createScheduleDto: CreateScheduleDto) {
    const theater = await this.theaterRepository.findOneBy({ id: createScheduleDto.theaterId });
    const box = await this.boxRepository.findOneBy({ id: createScheduleDto.boxId });
    const show = await this.showRepository.findOneBy({ id: createScheduleDto.showId });
    if (!theater) {
      throw new BadRequestException('존재하지 않는 극장입니다 확인해주세요.')
    }
    if ( box.theater.id !== theater.id ) {
      throw new BadRequestException('극장에 존재하지 않는 상영관입니다 확인해주세요.')
    }
    if (!show || show.status !== Status.Open) {
      throw new BadRequestException('현재 상영 중이지 않는 영화입니다 확인해주세요')
    }

    const showTime = new Date(createScheduleDto.showTime);
    const now = new Date();
    if(showTime < now){
      throw new BadRequestException('현재 시간 이후에만 상영 시간 생성이 가능합니다.');
    }

    await this.scheduleRepository.save({
      show: show,
      theater: theater,
      box: box,
      showTime: createScheduleDto.showTime,
    });
  }

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
