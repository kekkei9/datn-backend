import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterDoctorRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly status: object;
}
