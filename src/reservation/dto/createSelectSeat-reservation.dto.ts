import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Grade } from '../../seat/seatGrade.type';

export class CreateSelectSeatReservationDto{
  @IsNumber()
  @IsNotEmpty({ message: '공연 일정을 선택해주세요' })
  scheduleId: number;

  @IsNumber()
  @IsNotEmpty({ message: '관람인원을 선택해주세요' })
  numberOfSpectators: number;

  @IsString()
  @IsNotEmpty({ message: '좌석 등급을 선택해주세요' })
  grade: Grade[];

  @IsNumber()
  @IsNotEmpty({ message: '좌석 번호를 선택해주세요' })
  seatNumber: number[];
}
