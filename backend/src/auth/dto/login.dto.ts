import { IsEmail, IsNotEmpty } from 'class-validator';

 // Frontend'den gelen email ve password verilerini taşır

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
