import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {

  @IsNumber()
  @IsNotEmpty({ message: '공연 일정을 선택해주세요' })
  scheduleId: number;

  @IsNumber()
  @IsNotEmpty({ message: '관람인원을 선택해주세요' })
  numberOfSpectators: number;
}
