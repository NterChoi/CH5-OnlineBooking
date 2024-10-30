import { IsArray, IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: '공연을 선택해주세요' })
  showId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: '극장을 선택해주세요' })
  theaterId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: '상영관을 선택해주세요' })
  boxId: number;

  @ApiProperty()
  @IsArray()
  @Type(() => Date)
  @IsDate({ each: true })
  @IsNotEmpty({ message: '상영 시간을 입력해주세요' })
  showTime: Date[];
}
