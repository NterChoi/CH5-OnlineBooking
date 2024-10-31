import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/authSignUp.dto';
import { Role } from '../user/types/userRole.type';
import { AuthSignInDto } from './dto/authSignIn.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('AuthService.signUp 메소드가 올바른 인자와 함께 호출되는지 확인', async () => {
      const authSignUpDto: AuthSignUpDto = {
        email: 'test@test.com',
        password: 'test1234',
        confirmPassword: 'test1234',
        nickname: 'tester',
        role: Role.User,
      };

      const spy = jest.spyOn(authService, 'signUp').mockResolvedValue('회원가입이 성공했습니다.');
      await authController.signUp(authSignUpDto);

      expect(spy).toHaveBeenCalledWith(authSignUpDto);
    });
  });

  describe('signIn', () => {
    it('AuthService.signIn 메소드가 올바른 인자와 함께 호출되는지 확인', async () => {
      const authSignInDto: AuthSignInDto = {
        email: 'test@test.com',
        password: 'test1234',
      };

      const spy = jest.spyOn(authService, 'signIn').mockResolvedValue({
        access_token: 'some-jwt-token',
      });

      await authController.signIn(authSignInDto);

      expect(spy).toHaveBeenCalledWith(authSignInDto);
    });
  });
});

