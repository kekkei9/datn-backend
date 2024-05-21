import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class PostLoginResponse {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;
}

export class GetRefreshResponse {
  @ApiProperty()
  readonly accessToken: string;
}
