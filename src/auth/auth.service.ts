import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthSignInDto } from './dto/authSignIn.dto';
import { AuthSignUpDto } from './dto/authSignUp.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Point } from '../point/entities/point.entity';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';
import bcrypt, { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    private readonly jwtService: JwtService,
  ) {
  }

  async signUp(authSignUpDto: AuthSignUpDto) {
    return await this.entityManager.transaction(async (manager) => {
      const existingUser = await this.userRepository.findOne({ where: { email: authSignUpDto.email } });
      if (existingUser) {
        throw new ConflictException('이미 사용중인 이메일입니다.');
      }

      const hashedPassword = await bcrypt.hash(authSignUpDto.password, 10);

      // 1. 유저 생성
      const user = await manager.getRepository(User).save({
        email: authSignUpDto.email,
        password: hashedPassword,
        nickname: authSignUpDto.nickname,
        role: authSignUpDto.role,
      });
      // 2. 포인트 지급

      await manager.getRepository(Point).save({
        user: user,
        value: 1000000,
        description: '가입 지급 포인트',
      });
      return '회원가입이 성공했습니다!';
    });
  }

  // TODO : JWT 토큰 값 소멸 시간 설정하기
  async signIn(authSignInDto: AuthSignInDto) {
    const user: User = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email: authSignInDto.email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }
    if (!(await compare(authSignInDto.password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email: authSignInDto.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
