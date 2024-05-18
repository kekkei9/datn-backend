import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InitVerificationDto {
  @ApiProperty()
  @IsString()
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
