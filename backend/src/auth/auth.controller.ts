import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// Kimlik doğrulama ile ilgili istekleri işler

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
// Kayıt olma isteğini işler
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
// Giriş yapma isteğini işler
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
