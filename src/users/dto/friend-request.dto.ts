import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FriendRequest_Status } from '../entities/friend-request.interface';

export class ResponseFriendRequestDto {
  @ApiProperty({
    enum: [
      'accepted',
      'not-sent',
      'pending',
      'declined',
      'waiting-for-current-user-response',
    ],
  })
  @IsString()
  @IsNotEmpty()
  readonly status: FriendRequest_Status;
}
