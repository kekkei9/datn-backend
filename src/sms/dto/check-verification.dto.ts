import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class InitVerificationDto {
  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phoneNumber: string;
}

export class CheckVerificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly pinId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
