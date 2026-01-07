import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Controller/metod icin gerekli roller metadata olarak eklenir.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
