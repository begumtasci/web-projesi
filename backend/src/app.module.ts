import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { RentalsModule } from './rentals/rentals.module';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Vehicle } from './vehicles/vehicle.entity';
import { Rental } from './rentals/rental.entity';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: Number(config.get<number>('DB_PORT', 1433)),
        username: config.get<string>('DB_USERNAME', 'sa'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'RentACarDB'),
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
        entities: [User, Role, Vehicle, Rental],
        synchronize: true,
      }),
    }),

    TypeOrmModule.forFeature([User, Role, Vehicle]),
    UsersModule,
    AuthModule,
    RolesModule,
    VehiclesModule,
    RentalsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
