import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { PointModule } from './point/point.module';
import Joi from 'joi';
import { User } from './user/entities/user.entity';
import { Point } from './point/entities/point.entity';
import { ShowModule } from './show/show.module';
import { ScheduleModule } from './schedule/schedule.module';
import { Show } from './show/entities/show.entity';
import { Schedule } from './schedule/entities/schedule.entity';
import { Theater } from './theater/theater.entity';
import { Box } from './box/box.entity';
import { Seat } from './seat/seat.entity';
import { ReservationModule } from './reservation/reservation.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [User, Point, Show, Schedule, Theater, Box, Seat],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService]
}

@Module({
  imports: [UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    PointModule,
    ShowModule,
    ScheduleModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
