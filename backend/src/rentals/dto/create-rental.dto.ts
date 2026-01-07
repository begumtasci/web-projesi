import { IsDateString, IsInt, Min } from 'class-validator';

export class CreateRentalDto {
  @IsInt()
  vehicleId!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsInt()
  @Min(1)
  days!: number;
}
