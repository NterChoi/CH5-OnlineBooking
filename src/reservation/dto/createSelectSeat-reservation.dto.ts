import { IsArray, IsEnum, IsNotEmpty, IsNumber, } from 'class-validator';
import { Grade } from '../../seat/seatGrade.type';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


export class CreateSelectSeatReservationDto{
  @ApiProperty({example : 1})
  @IsNumber()
  @IsNotEmpty({ message: '공연 일정을 선택해주세요' })
  scheduleId: number;

  @ApiProperty({example : 1})
  @IsNumber()
  @IsNotEmpty({ message: '관람인원을 선택해주세요' })
  numberOfSpectators: number;

  @ApiProperty({example : [1]})
  @IsArray()
  @Type(()=> Number)
  @IsNumber({allowNaN: false}, { each: true})
  @IsNotEmpty({ message: '좌석 번호를 선택해주세요' })
  seatId: number[];
}
