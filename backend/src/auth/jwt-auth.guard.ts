import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// JWT stratejisini kullanan standart Passport guard.
export class JwtAuthGuard extends AuthGuard('jwt') {}
