import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly code: string;
}

export class SendFriendRequestDto {
  @ApiProperty({
    enum: ['OTP'],
  })
  @IsString()
  @IsOptional()
  readonly method: 'OTP';
}
