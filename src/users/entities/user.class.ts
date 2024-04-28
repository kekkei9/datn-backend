import { IsEmail, IsString } from 'class-validator';
import { Role } from 'src/auth/models/roles.model';

export class User {
  id?: number;
  firstName?: string;
  lastName?: string;
  @IsEmail()
  email?: string;
  @IsString()
  password?: string;
  role?: Role;
}
