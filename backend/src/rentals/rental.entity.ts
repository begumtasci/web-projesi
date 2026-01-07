import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

@Entity({ name: 'rentals' })
export class Rental {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.rentals, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.rentals, { eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @Column('decimal')
  totalPrice!: number;

  @Column({ default: 'pending' })
  rentalStatus!: string;
}
