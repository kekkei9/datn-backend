import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DefaultPaginationDto {
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

  constructor(page = 1, pageSize = 15) {
    this.page = page;
    this.pageSize = pageSize;
  }
}
