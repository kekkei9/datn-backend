import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateDiaryDto {
  @ApiProperty()
  data: object;

  @ApiProperty()
  @IsNumber()
  belongTo: number;
}
