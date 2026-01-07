import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsInt()
  year!: number;

  @IsString()
  fuelType!: string;

  @IsString()
  gearType!: string;

  @IsNumber()
  dailyPrice!: number;

  @IsString()
  photoUrl!: string;

  @IsString()
  status!: string;
}
