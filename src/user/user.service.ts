import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Point } from '../point/entities/point.entity';

@Injectable()
export class UserService {
  constructor(
              @InjectRepository(User)
              private userRepository: Repository<User>,
              @InjectRepository(Point)
              private pointRepository: Repository<Point>,
              private readonly jwtService: JwtService) {
  }

  async showProfile(userId: number) {
    const point = await this.pointRepository
      .createQueryBuilder('point')
      .select('SUM(point.value)', 'sum')
      .where('point.userId = :userId', { userId })
      .getRawOne();

    const user = await this.userRepository.findOneBy({ id: userId });

    return {
      nickname: user.nickname,
      point: point,
    }
  }
}
