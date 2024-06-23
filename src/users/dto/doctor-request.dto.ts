import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsObject } from 'class-validator';

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

export class ResponseDoctorRequestDto {
  @ApiProperty()
  @IsBoolean()
  readonly accept: boolean;
}
