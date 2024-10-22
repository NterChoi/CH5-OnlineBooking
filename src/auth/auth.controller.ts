import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/authSignUp.dto';
import { AuthSignInDto } from './dto/authSignIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('signup')
  async signUp(@Body() authSignUpDto :AuthSignUpDto){
    return await this.authService.signUp(authSignUpDto);
  }

  @Post('signin')
  async signIn(@Body() authSignInDto: AuthSignInDto){
    return await this.authService.signIn(authSignInDto);
  }
}
