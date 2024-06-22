import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDoctorSpecialtyDto {
  @ApiProperty()
  @IsString()
  label: string;
}
