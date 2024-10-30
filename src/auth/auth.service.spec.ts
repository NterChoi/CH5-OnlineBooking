import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EntityManager, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Point } from '../point/entities/point.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../user/types/userRole.type';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let pointRepository: Repository<Point>;
  let entityManager: EntityManager;
  let jwtService: JwtService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: EntityManager,
          useValue: {
            transaction: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Point),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    pointRepository = module.get<Repository<Point>>(getRepositoryToken(Point));
    entityManager = module.get<EntityManager>(EntityManager);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp',() => {
    it('유저가 이미 존재하면 ConflictException 던진다.', async () => {
      // 유저가 이미 존재하는 상황을 Mock
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(new User());

      // 트랜잭션 Mock 설정
      entityManager.transaction = jest.fn().mockImplementation(async (cb) => {
        const transactionalEntityManager = {
          getRepository: (entity) => ({
            save: jest.fn(), // save는 호출되지 않음
          }),
        };
        return cb(transactionalEntityManager);
      });

      // signUp 호출 시 ConflictException 발생 예상
      await expect(authService.signUp({
        email: 'test@test.com',
        password: 'test1234',
        confirmPassword: 'test1234',
        nickname: 'tester',
        role: Role.User,
      })).rejects.toThrow(ConflictException);
    });


    it('유저를 생성하고 포인트를 지급한다.', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword' as never);
      const transactionMock = jest.fn().mockImplementation(async (cb) => cb({
        getRepository: () => ({
          save: jest.fn().mockResolvedValueOnce(new User()),
        }),
      }));
      entityManager.transaction = transactionMock;

      const result = await authService.signUp({
        email: 'test@test.com',
        password: 'test1234',
        confirmPassword: 'test1234',
        nickname: 'tester',
        role: Role.User,
      });

      expect(result).toBe('회원가입이 성공했습니다!');
      expect(transactionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('signIn', () => {
    it('유저가 존재하지 않으면 UnauthorizedException 던진다.', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(authService.signIn({
        email: 'test@test.com',
        password: 'password',
      })).rejects.toThrow(UnauthorizedException);
    });

    it('비밀번호가 다르면 UnauthorizedException 던진다', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('wrongPassword', 10),
      } as User);

      await expect(authService.signIn({
        email: 'test@test.com',
        password: 'password',
      })).rejects.toThrow(UnauthorizedException);
    });

    it('로그인 정보가 동일하면 access token 반환', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      } as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockedAccessToken');

      const result = await authService.signIn({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toEqual({
        access_token: 'mockedAccessToken',
      })

    });
  });
});
