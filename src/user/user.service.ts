import { ConflictException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Role } from './types/userRole.type';
import { Point } from '../point/entities/point.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(@InjectEntityManager() private readonly entityManager: EntityManager,
              @InjectRepository(User)
              private userRepository: Repository<User>,
              @InjectRepository(Point)
              private pointRepository: Repository<Point>,
              private readonly jwtService: JwtService) {
  }

  async create(createUserDto: SignupDto): Promise<User> {
    return await this.entityManager.transaction(async (manager) => {
      const existingUser = await this.userRepository.findOneBy({email: createUserDto.email});
      if (existingUser) {
        throw new ConflictException('이미 사용중인 이메일입니다.');
      }
      // 1. 유저 생성
      const user = await manager.getRepository(User).save({
        email: createUserDto.email,
        password: createUserDto.password,
        nickname: createUserDto.nickname,
        role: createUserDto.role,
      });
      // 2. 포인트 지급
      await this.pointRepository.save({
        userId: user.id,
        value: 1000000,
        description: '가입 지급 포인트',
      });
      return user;
    });
  }

  async login(loginDTO: LoginDto) {
    const user = await this.userRepository.findOne({

    })
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
