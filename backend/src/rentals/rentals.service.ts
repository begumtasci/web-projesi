import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepo: Repository<Rental>,
    private readonly vehiclesService: VehiclesService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, dto: CreateRentalDto) {
    const vehicle = await this.vehiclesService.findOne(dto.vehicleId);
    if (vehicle.status !== 'available') {
      throw new BadRequestException('Vehicle not available');
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const totalPrice = Number(vehicle.dailyPrice) * dto.days;
    const rental = this.rentalRepo.create({
      vehicle,
      user,
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalPrice,
      rentalStatus: 'active',
    });
    vehicle.status = 'rented';
    await this.vehiclesService.update(vehicle.id, { status: 'rented' });
    return this.rentalRepo.save(rental);
  }

  findAll() {
    return this.rentalRepo.find({ order: { id: 'DESC' } });
  }

  findMine(userId: number) {
    return this.rentalRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }
}
