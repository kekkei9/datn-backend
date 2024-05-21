import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetAllDrugsDto {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  pageSize: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  filterAll: string;

  constructor(page = 1, pageSize = 15) {
    this.page = page;
    this.pageSize = pageSize;
  }
}
