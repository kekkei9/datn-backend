import { ApiProperty } from '@nestjs/swagger';
import { IsJSON } from 'class-validator';

export class CreateDiaryDto {
  @ApiProperty()
  @IsJSON()
  data: string;
}
