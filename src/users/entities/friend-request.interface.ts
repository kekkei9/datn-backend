import { UserEntity } from './user.entity';

export enum FriendRequestStatus {
  NOT_SENT = 'not-sent',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  WAITING_FOR_CURRENT_USER_RESPONSE = 'waiting-for-current-user-response',
}

export interface FriendRequest {
  id?: number;
  creator?: UserEntity;
  receiver?: UserEntity;
  status?: FriendRequestStatus;
}
