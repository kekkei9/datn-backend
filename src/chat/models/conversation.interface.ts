import { User } from '../../users/entities/user.entity';

export interface Conversation {
  id?: number;
  users?: User[];
  lastUpdated?: Date;
}
