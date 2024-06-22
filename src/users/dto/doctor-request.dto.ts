import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class RegisterDoctorRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  readonly metadata: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  readonly specialties: number[];
}
