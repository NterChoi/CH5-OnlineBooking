import { Injectable } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
  ) {}
  async create(createShowDto: CreateShowDto) {
    return await this.showRepository.save({
      image: createShowDto.image,
      name: createShowDto.name,
      category: createShowDto.category,
      info: createShowDto.info,
      status: createShowDto.status,
      openDate: createShowDto.openDate,
      endDate: createShowDto.endDate,
    });
  }

  async findAll() {
    return await this.showRepository.find({
      select : {
        image: true,
        name: true,
        category: true,
        status: true,
        openDate: true
      }
    });
  }

  async findByCategory(category : string) {
    return await this.showRepository.find({
        select: ['image', 'name', 'category', 'status', 'openDate'],
        where:{ category: category,}
    });
  }

  async findByName(name: string) {
    return await this.showRepository.find({
      select: {
        image: true,
        name: true,
        category: true,
        status: true,
        openDate: true,
      },
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  async findOne(id: number) {
    return await this.showRepository.find({
      select:{
        image : true,
        name : true,
        category: true,
        info: true,
        status: true,
        openDate: true,
        endDate: true,
      },
      relations:{
        schedule: true
      },
      where: {
        id: id,
      },
    });
  }
}
