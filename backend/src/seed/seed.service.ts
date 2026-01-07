import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from '../roles/role.entity';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Vehicle) private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async onModuleInit() {
    await this.ensureRolesAndAdmin();
    await this.ensureVehicles();
  }

  private async ensureRolesAndAdmin() {
    const roles = ['ADMIN', 'USER'];
    for (const roleName of roles) {
      const existing = await this.roleRepo.findOne({ where: { roleName } });
      if (!existing) {
        await this.roleRepo.save({ roleName });
      }
    }

    const adminRole = await this.roleRepo.findOne({
      where: { roleName: 'ADMIN' },
    });
    const existingAdmin = await this.userRepo.findOne({
      where: { email: 'admin@rentacar.local' },
    });
    if (!existingAdmin && adminRole) {
      const password = await bcrypt.hash('Admin123!', 10);
      await this.userRepo.save({
        name: 'Admin',
        email: 'admin@rentacar.local',
        password,
        role: adminRole,
      });
    }
  }

  private async ensureVehicles() {
    const count = await this.vehicleRepo.count();
    if (count > 0) return;
    const seedData: Partial<Vehicle>[] = [
      {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        fuelType: 'Benzin',
        gearType: 'Otomatik',
        dailyPrice: 45,
        status: 'available',
        photoUrl: 'uploads/toyota.jfif',
      },
      {
        brand: 'Renault',
        model: 'Clio',
        year: 2021,
        fuelType: 'Dizel',
        gearType: 'Düz',
        dailyPrice: 35,
        status: 'available',
        photoUrl: 'uploads/toyota.jfif',
      },
      {
        brand: 'Tesla',
        model: 'Model 3',
        year: 2023,
        fuelType: 'Elektrik',
        gearType: 'Otomatik',
        dailyPrice: 90,
        status: 'maintenance',
        photoUrl: 'uploads/toyota.jfif',
      },
    ];
    await this.vehicleRepo.save(seedData);
  }
}
