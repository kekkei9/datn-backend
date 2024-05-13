import { User } from '../../users/entities/user.entity';
import { Conversation } from './conversation.interface';

export interface Message {
  id?: number;
  message?: string;
  user?: User;
  conversation: Conversation;
  createdAt?: Date;
}
