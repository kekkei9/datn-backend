import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNumber } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty()
  @IsJSON()
  data: string;

  @ApiProperty()
  @IsNumber()
  belongTo: number;
}
