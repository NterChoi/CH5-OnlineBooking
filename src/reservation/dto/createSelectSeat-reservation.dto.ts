import { IsArray, IsEnum, IsNotEmpty, IsNumber, } from 'class-validator';
import { Grade } from '../../seat/seatGrade.type';
import { Type } from 'class-transformer';


export class CreateSelectSeatReservationDto{
  @IsNumber()
  @IsNotEmpty({ message: '공연 일정을 선택해주세요' })
  scheduleId: number;

  @IsNumber()
  @IsNotEmpty({ message: '관람인원을 선택해주세요' })
  numberOfSpectators: number;

  // @IsArray()
  // @Type(()=> Number)
  // @IsEnum(Grade, {each: true})
  // @IsNotEmpty({ message: '좌석 등급을 선택해주세요' })
  // grade: Grade[];

  @IsArray()
  @Type(()=> Number)
  @IsNumber({allowNaN: false}, { each: true})
  @IsNotEmpty({ message: '좌석 번호를 선택해주세요' })
  seatId: number[];
}
