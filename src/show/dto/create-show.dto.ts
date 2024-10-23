import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../type/showStatus.type';

export class CreateShowDto {
  @IsString()
  image: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '카테고리를 입력해주세요.' })
  category: string;

  @IsString()
  info: string;

  @IsEnum(Status)
  @IsNotEmpty({message: '판매상태를 입력해주세요.'})
  status: Status;

  @IsString()
  @IsNotEmpty({ message: '개봉일자를 입력해주세요.' })
  openDate: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}
