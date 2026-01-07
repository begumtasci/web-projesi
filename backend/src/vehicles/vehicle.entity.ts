import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rental } from '../rentals/rental.entity';

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column()
  fuelType!: string;

  @Column()
  gearType!: string;

  @Column('decimal')
  dailyPrice!: number;

  @Column({ default: '' })
  photoUrl!: string;

  @Column({ default: 'available' })
  status!: string;

  @OneToMany(() => Rental, (rental) => rental.vehicle)
  rentals!: Rental[];
}
