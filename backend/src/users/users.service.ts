import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto, roleName = 'USER') {
    const role = await this.rolesService.findByName(roleName);
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }
    const password = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password, role });
    return this.userRepo.save(user);
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async findAll() {
    return this.userRepo.find();
  }
}
