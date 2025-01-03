import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {

  @ApiProperty({example : 1})
  @IsNumber()
  @IsNotEmpty({ message: '공연 일정을 선택해주세요' })
  scheduleId: number;

  @ApiProperty({example : 1})
  @IsNumber()
  @IsNotEmpty({ message: '관람인원을 선택해주세요' })
  numberOfSpectators: number;
}
