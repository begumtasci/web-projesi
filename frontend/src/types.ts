export type RoleName = 'ADMIN' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: {
    id: number;
    roleName: RoleName;
  };
}

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  gearType: string;
  dailyPrice: number;
  photoUrl: string;
  status: string;
}

export interface Rental {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  rentalStatus: string;
  vehicle: Vehicle;
  user: User;
}
