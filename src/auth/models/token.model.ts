import { Role } from '../../users/entities/user.entity';

export interface PayloadToken {
  id: number;
  role: Role;
}
