import { CreateUserDto } from '../../users/dto/create-user.dto';
// Frontend'den gelen kayıt verilerini taşır 
// CreateUserDto'dan miras alır
export class RegisterDto extends CreateUserDto {}
