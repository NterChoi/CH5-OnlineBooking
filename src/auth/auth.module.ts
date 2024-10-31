import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Point } from '../point/entities/point.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt', session: false}),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Point]),
    UserModule,
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
