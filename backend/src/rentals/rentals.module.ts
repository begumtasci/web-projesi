import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './rental.entity';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental]),
    forwardRef(() => VehiclesModule),
    forwardRef(() => UsersModule),
  ],
  providers: [RentalsService],
  controllers: [RentalsController],
})
export class RentalsModule {}
