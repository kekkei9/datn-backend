import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FriendRequestStatus } from '../entities/friend-request.interface';

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
  readonly status: FriendRequestStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly code: string;
}

export class SendFriendRequestDto {
  @ApiProperty({
    enum: ['OTP'],
  })
  @IsEnum(['OTP'])
  @IsOptional()
  readonly method: 'OTP';
}
