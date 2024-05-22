import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty()
  data: object;

  @ApiProperty()
  @IsNumber()
  belongTo: number;
}

export class PatchPrescriptionDto {
  @ApiProperty()
  data: object;
}
