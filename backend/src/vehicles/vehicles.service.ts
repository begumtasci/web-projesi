import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  create(dto: CreateVehicleDto) {
    const vehicle = this.vehicleRepo.create(dto);
    return this.vehicleRepo.save(vehicle);
  }

  findAll() {
    return this.vehicleRepo.find();
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepo.findOne({ where: { id } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async update(id: number, dto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, dto);
    return this.vehicleRepo.save(vehicle);
  }

  async remove(id: number) {
    const vehicle = await this.findOne(id);
    await this.vehicleRepo.remove(vehicle);
    return { deleted: true };
  }
}
