import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../type/showStatus.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShowDto {
  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '카테고리를 입력해주세요.' })
  category: string;

  @ApiProperty()
  @IsString()
  info: string;

  @ApiProperty()
  @IsEnum(Status)
  @IsNotEmpty({message: '판매상태를 입력해주세요.'})
  status: Status;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '개봉일자를 입력해주세요.' })
  openDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  endDate?: string;
}
