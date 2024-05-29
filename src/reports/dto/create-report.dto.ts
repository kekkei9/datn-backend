import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
