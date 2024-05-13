import { UserEntity } from '../../users/entities/user.entity';

export interface Conversation {
  id?: number;
  users?: UserEntity[];
  lastUpdated?: Date;
}
