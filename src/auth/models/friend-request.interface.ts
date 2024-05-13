import { UserEntity } from './user.class';

export type FriendRequest_Status =
  | 'not-sent'
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'waiting-for-current-user-response';

export interface FriendRequestStatus {
  status?: FriendRequest_Status;
}

export interface FriendRequest {
  id?: number;
  creator?: UserEntity;
  receiver?: UserEntity;
  status?: FriendRequest_Status;
}
