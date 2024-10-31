import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../type/showStatus.type';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateShowDto {
  @ApiProperty({example : 'test_image'})
  @IsString()
  image: string;

  @ApiProperty({example : 'EPL LIV VS MCI'})
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @ApiProperty({example : 'sports'})
  @IsString()
  @IsNotEmpty({ message: '카테고리를 입력해주세요.' })
  category: string;

  @ApiProperty({example : 'test_info'})
  @IsString()
  info: string;

  @ApiProperty({example : 1})
  @IsEnum(Status)
  @IsNotEmpty({message: '판매상태를 입력해주세요.'})
  status: Status;

  @ApiProperty({ example: '2024-10-27', format: 'date' })
  @IsDate()
  @IsNotEmpty({ message: '개봉일자를 입력해주세요.' })
  @Type(()=> Date)
  openDate: Date;

  @ApiProperty({example : null})
  @IsDate()
  @IsOptional()
  @Type(()=> Date)
  endDate?: Date;
}
