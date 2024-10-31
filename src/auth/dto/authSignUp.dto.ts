import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Match } from '../../utils/match.decorator';
import { Role } from '../../user/types/userRole.type';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignUpDto {
  @ApiProperty(
    {example : 'test@test.com'}
  )
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  @ApiProperty({example: 'test1234'})
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password: string;

  @ApiProperty({example: 'test1234'})
  @IsString()
  @IsNotEmpty({message: '비밀번호 확인을 입력해주세요'})
  @Match('password', {message : '비밀번호와 비밀번호 확인이 일치하지 않습니다.'})
  confirmPassword: string

  @ApiProperty({example: 'tester'})
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  nickname: string;

  @ApiProperty({example : 1})
  @IsEnum(Role)
  @IsNotEmpty({ message: '역할을 입력해주세요' })
  role: Role;
}
