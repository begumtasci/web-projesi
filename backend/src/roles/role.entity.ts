import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  roleName!: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
