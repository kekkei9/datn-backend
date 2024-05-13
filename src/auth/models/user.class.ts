import { IsEmail, IsString } from 'class-validator';
import { Role } from './roles.model';

export class UserEntity {
  id?: number;
  firstName?: string;
  lastName?: string;
  @IsEmail()
  email?: string;
  @IsString()
  password?: string;
  imagePath?: string;
  role?: Role;
}
