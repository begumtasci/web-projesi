import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

//Kullanıcı kayıt, giriş ve token üretimi burada yapılır
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // Kullanıcı işlemleri için servis
    private readonly jwtService: JwtService,
  ) {}

  // Yeni kullanıcı kaydı
  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);// Aynı email ile kayıtlı kullanıcı var mı kontrolü
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const user = await this.usersService.createUser(dto, 'USER');
    return this.buildToken(user);
  }

  // Kullanıcı girişi
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');
    // Şifre doğrulama
    const match = await bcrypt.compare(dto.password, user.password);

    if (!match) throw new UnauthorizedException('Invalid credentials');
    return this.buildToken(user);
  }

  private async buildToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
