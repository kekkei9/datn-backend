import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FriendRequest_Status } from '../entities/friend-request.interface';

export class ResponseFriendRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly status: FriendRequest_Status;
}
