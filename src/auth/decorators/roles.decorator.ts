import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/entities/user.entity';

export const ROLE_KEY = 'role';

export const Roles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);
