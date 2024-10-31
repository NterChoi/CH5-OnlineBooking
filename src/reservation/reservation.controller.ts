import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CreateSelectSeatReservationDto } from './dto/createSelectSeat-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from '../utils/userinfo.decorator';
import { User } from '../user/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('reservation')
@UseGuards(AuthGuard('jwt'))
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {
  }

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @UserInfo() user: User,
  ) {
    return this.reservationService.create(createReservationDto, user);
  }

  @Post('select-seat')
  createSelectSeat(
    @Body() createSelectSeatReservationDto: CreateSelectSeatReservationDto,
    @UserInfo() user : User,
  ){
    return this.reservationService.createSelectSeat(createSelectSeatReservationDto, user)
  }

  @Get()
  findAll(
    @UserInfo() user: User,
  ) {
    return this.reservationService.findAll(user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserInfo() user: User,
  ) {
    return this.reservationService.remove(+id, user);
  }
}
